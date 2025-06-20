"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm, UseFormReturn, Path, DefaultValues } from "react-hook-form";
import { z, ZodTypeAny } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props<T extends FieldValues> {
  schema: ZodTypeAny;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    console.log(result);

    if(result.success) {
      toast(isSignIn ? "You have successfully signed in" : "You have successfully signed up");
      router.push("/");
    } else {
      toast(isSignIn ? `Error signing in ${result.error}` : `Error signing up ${result.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">{isSignIn ? "Welcome Back to Permpus" : "Create your library account"}</h1>
      <p className="text-light-100">{isSignIn ? "Acces the vast collection of books, and stay updated" : "Please complete all fields and upload a valid university ID to gain access to the library"}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
          {Object.keys(defaultValues).map((field, index) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                  <FormControl>{field.name === 'kampusCard' ? <ImageUpload onFileChange={field.onChange} /> : <Input required type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} {...field} className="form-input" />}</FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className="form-btn">{isSignIn ? 'Sign In' : 'Sign Up'}</Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to Permpus? " : "Already have an account? "}
        <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-primary">
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
