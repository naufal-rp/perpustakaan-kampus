"use client";

import AuthForm from "@/components/AuthForm";
import { signUp } from "@/lib/actions/auth";
import { signUpSchema } from "@/lib/validations";
import React from "react";

const Page = () => (
  <AuthForm type="SIGN_UP" schema={signUpSchema} defaultValues={{ email: '', password: '', fullName: '', kampusId: 0, kampusCard: '' }} onSubmit={signUp} />
);

export default Page;
