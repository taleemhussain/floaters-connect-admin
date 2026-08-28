import { Router, type IRouter, type RequestHandler } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import {
  GetAdminDisputesResponse,
  GetAdminTagsResponse,
  GetAdminUsersResponse,
  ResolveAdminDisputeBody,
  ResolveAdminDisputeParams,
  ResolveAdminDisputeResponse,
  ToggleAdminUserBanParams,
  ToggleAdminUserBanResponse,
  UpsertAdminTagBody,
  UpsertAdminTagResponse,
  VerifyAdminUserParams,
  VerifyAdminUserResponse,
} from "@workspace/api-zod";
import { firebaseAuth, firestore } from "../lib/firebase-admin.js";

const router: IRouter = Router();

function toIsoDate(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
}

function normalizeUser(uid: string, data: Record<string, unknown>) {
  const role =
    data.role === "driver" ||
    data.role === "runner" ||
    data.role === "admin" ||
    data.role === "unset"
      ? data.role
      : "unset";

  return {
    uid,
    email: typeof data.email === "string" ? data.email : "",
    displayName:
      typeof data.displayName === "string" ? data.displayName : "Unnamed user",
    role,
    onboardingStatus:
      typeof data.onboardingStatus === "string"
        ? data.onboardingStatus
        : "registered",
    isBanned: data.isBanned === true,
    createdAt: toIsoDate(data.createdAt),
  };
}

function normalizeDispute(id: string, data: Record<string, unknown>) {
  return {
    id,
    gigId: typeof data.gigId === "string" ? data.gigId : "",
    reporterName:
      typeof data.reporterName === "string" ? data.reporterName : "Unknown",
    reporterRole:
      typeof data.reporterRole === "string" ? data.reporterRole : "unknown",
    accusedName:
      typeof data.accusedName === "string" ? data.accusedName : "Unknown",
    reason: typeof data.reason === "string" ? data.reason : "",
    status: data.status === "resolved" ? ("resolved" as const) : ("open" as const),
    resolution:
      typeof data.resolution === "string" ? data.resolution : null,
    createdAt: toIsoDate(data.createdAt) ?? new Date(0).toISOString(),
    evidenceUrl:
      typeof data.evidenceUrl === "string" && data.evidenceUrl
        ? data.evidenceUrl
        : null,
  };
}

function normalizeTag(id: string, data: Record<string, unknown>) {
  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    description:
      typeof data.description === "string" ? data.description : "",
    active: data.active === true,
  };
}

const requireFirebaseAuth: RequestHandler = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";

  if (!token) {
    res.status(401).json({
      code: "AUTH_UNAUTHORIZED",
      message: "Missing or invalid Authorization Bearer token.",
    });
    return;
  }

  try {
    res.locals.firebaseUser = await firebaseAuth.verifyIdToken(token);
    next();
  } catch (error) {
    req.log.warn(
      { err: error },
      "Rejected invalid or expired Firebase ID token",
    );
    res.status(401).json({
      code: "AUTH_UNAUTHORIZED",
      message: "Firebase ID token is invalid or expired.",
    });
  }
};

const requireAdminRole: RequestHandler = async (req, res, next) => {
  const user = res.locals.firebaseUser as DecodedIdToken | undefined;

  if (!user?.uid) {
    res.status(403).json({
      code: "ACCESS_DENIED",
      message: "No authenticated user found.",
    });
    return;
  }

  try {
    const userSnapshot = await firestore.collection("users").doc(user.uid).get();
    if (!userSnapshot.exists) {
      res.status(403).json({
        code: "USER_NOT_FOUND",
        message: "User profile does not exist in our database.",
      });
      return;
    }

    if (userSnapshot.data()?.role !== "admin") {
      res.status(403).json({
        code: "ADMIN_REQUIRED",
        message: "This resource requires administrator privileges.",
      });
      return;
    }

    next();
  } catch (error) {
    req.log.error({ err: error }, "Unable to verify Firebase administrator role");
    res.status(403).json({
      code: "ACCESS_DENIED",
      message: "Unable to verify administrative authorization.",
    });
  }
};

router.use("/v1/admin", requireFirebaseAuth, requireAdminRole);

router.get("/v1/admin/users", async (_req, res) => {
  const snapshot = await firestore.collection("users").get();
  const users = snapshot.docs.map((doc) => normalizeUser(doc.id, doc.data()));
  res.json(GetAdminUsersResponse.parse(users));
});

router.post("/v1/admin/users/:uid/toggle-ban", async (req, res) => {
  const { uid } = ToggleAdminUserBanParams.parse(req.params);
  const reference = firestore.collection("users").doc(uid);
  const snapshot = await reference.get();

  if (!snapshot.exists) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const isBanned = snapshot.data()?.isBanned !== true;
  await reference.update({ isBanned });
  const user = normalizeUser(uid, { ...snapshot.data(), isBanned });
  res.json(ToggleAdminUserBanResponse.parse({ success: true, user, isBanned }));
});

router.post("/v1/admin/users/:uid/verify", async (req, res) => {
  const { uid } = VerifyAdminUserParams.parse(req.params);
  const reference = firestore.collection("users").doc(uid);
  const snapshot = await reference.get();

  if (!snapshot.exists) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  await reference.update({ onboardingStatus: "registered" });
  const user = normalizeUser(uid, {
    ...snapshot.data(),
    onboardingStatus: "registered",
  });
  res.json(
    VerifyAdminUserResponse.parse({
      success: true,
      user,
      onboardingStatus: "registered",
    }),
  );
});

router.get("/v1/admin/disputes", async (_req, res) => {
  const snapshot = await firestore.collection("disputes").get();
  const disputes = snapshot.docs.map((doc) =>
    normalizeDispute(doc.id, doc.data()),
  );
  res.json(GetAdminDisputesResponse.parse(disputes));
});

router.post("/v1/admin/disputes/:id/resolve", async (req, res) => {
  const { id } = ResolveAdminDisputeParams.parse(req.params);
  const { resolution } = ResolveAdminDisputeBody.parse(req.body);
  const reference = firestore.collection("disputes").doc(id);
  const snapshot = await reference.get();

  if (!snapshot.exists) {
    res.status(404).json({ success: false, message: "Dispute not found" });
    return;
  }

  await reference.update({ status: "resolved", resolution });
  const dispute = normalizeDispute(id, {
    ...snapshot.data(),
    status: "resolved",
    resolution,
  });
  res.json(
    ResolveAdminDisputeResponse.parse({
      success: true,
      dispute,
      id,
      status: "resolved",
      resolution,
    }),
  );
});

router.get("/v1/admin/tags", async (_req, res) => {
  const snapshot = await firestore.collection("skill_tags").get();
  const tags = snapshot.docs.map((doc) => normalizeTag(doc.id, doc.data()));
  res.json(GetAdminTagsResponse.parse(tags));
});

router.post("/v1/admin/tags", async (req, res) => {
  const input = UpsertAdminTagBody.parse(req.body);
  const collection = firestore.collection("skill_tags");
  const id = input.id || collection.doc().id;
  const tag = {
    id,
    name: input.name,
    description: input.description,
    active: input.active,
  };

  await collection.doc(id).set(
    {
      name: tag.name,
      description: tag.description,
      active: tag.active,
    },
    { merge: true },
  );
  res.json(UpsertAdminTagResponse.parse({ success: true, tag }));
});

export default router;