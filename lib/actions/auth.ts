"use server";

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export const signInWithCredentials = async (params: Pick<AuthCredentials, "email" | "password">) => {
  const { email, password } = params;

  const ip = (await headers()).get('x-forwared-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  if(!success) return redirect("/too-fast");  

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "Sign in error");
    return { success: false, error: "Sign in error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, kampusId, kampusCard, password } = params;

  const ip = (await headers()).get('x-forwared-for') || '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  if(!success) return redirect("/too-fast");

  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);
  try {
    await db.insert(users).values({
      fullName,
      email,
      kampusId,
      password: hashedPassword,
      kampusCard,
    });

    await workflowClient.trigger({
      url: `${config.env.apiEndpoint}/api/workflows/onboarding`,
      body: {
        email,
        fullName
      }
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log(error, "Sign up error");
    return { success: false, error: "Sign up error" };
  }
};
