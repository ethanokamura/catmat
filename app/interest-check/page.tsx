"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { submitInterestCheck } from "@/lib/services/interest-check";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import catmat from "@/assets/catmat-product.webp";
import peekmat from "@/assets/peekmat-product.webp";
import facemat from "@/assets/facemat-product.webp";
import { Separator } from "@/components/ui/separator";

const matOptions = [
  { id: "og-catmat", label: "OG CatMat" },
  { id: "peekmat", label: "PeekMat" },
  { id: "facemat", label: "FaceMat" },
] as const;

const priceOptions = [
  { id: "35-45", label: "$35-45" },
  { id: "45-55", label: "$45-55" },
  { id: "55-65", label: "$55-65" },
] as const;

const interestCheckSchema = z.object({
  mats: z.array(z.string()).min(1, "Please select at least one mat"),
  interestLevel: z.string().min(1, "Please select your interest level"),
  pricePoints: z
    .array(z.string())
    .min(1, "Please select at least one price point"),
  otherSizes: z.string().optional(),
  email: z.email("Please enter a valid email").optional(),
  suggestions: z.string().optional(),
});

type InterestCheckFormData = z.infer<typeof interestCheckSchema>;

export default function InterestCheckPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InterestCheckFormData>({
    resolver: zodResolver(interestCheckSchema),
    defaultValues: {
      mats: [],
      interestLevel: "",
      pricePoints: [],
      otherSizes: "",
      email: "",
      suggestions: "",
    },
  });

  const selectedMats = watch("mats");
  const selectedPricePoints = watch("pricePoints");
  const selectedInterestLevel = watch("interestLevel");

  function handleCheckboxChange(
    field: "mats" | "pricePoints",
    id: string,
    checked: boolean
  ) {
    const current = field === "mats" ? selectedMats : selectedPricePoints;
    if (checked) {
      setValue(field, [...current, id]);
    } else {
      setValue(
        field,
        current.filter((v) => v !== id)
      );
    }
  }

  async function onSubmit(data: InterestCheckFormData) {
    setIsSubmitting(true);
    try {
      await submitInterestCheck({
        mats: data.mats,
        interestLevel: parseInt(data.interestLevel),
        pricePoints: data.pricePoints,
        otherSizes: data.otherSizes ? data.otherSizes : null,
        email: data.email ? data.email : null,
        suggestions: data.suggestions ? data.suggestions : null,
      });
      setIsSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting interest check:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen pb-40">
        <header className="py-16 px-4 sm:px-6 text-center border-b">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
            Interest Check
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Let us know if you&apos;re interested in the Catmat collection.
          </p>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="text-muted-foreground mb-8">
            Your response has been recorded. We appreciate your interest in
            CATMAT and will keep you updated on our progress.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-40">
      {/* Header */}
      <header className="py-16 px-4 sm:px-6 text-center border-b">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
          Interest Check
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Help shape the future of CATMAT by sharing your preferences.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">CatMat</h2>
            <Image
              src={catmat}
              alt="CatMat"
              width={900}
              height={900}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">FaceMat</h2>
            <Image
              src={facemat}
              alt="FaceMat"
              width={900}
              height={900}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">PeekMat</h2>
            <Image
              src={peekmat}
              alt="PeekMat"
              width={900}
              height={900}
              className="rounded-lg"
            />
          </div>
        </section>
        <Separator className="my-8" />
        {/* Interest Check Form */}
        <section aria-labelledby="form-heading">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Mat Selection */}
              <FieldSet>
                <FieldLegend>
                  Which mat would you be interested in? *
                </FieldLegend>
                <FieldDescription>
                  Select all the designs you&apos;d consider purchasing.
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                  {matOptions.map((option) => (
                    <Field key={option.id} orientation="horizontal">
                      <Checkbox
                        id={`mat-${option.id}`}
                        checked={selectedMats.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("mats", option.id, !!checked)
                        }
                      />
                      <FieldLabel
                        htmlFor={`mat-${option.id}`}
                        className="font-normal cursor-pointer"
                      >
                        {option.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                {errors.mats && <FieldError>{errors.mats.message}</FieldError>}
              </FieldSet>

              <FieldSeparator />

              {/* Interest Level */}
              <FieldSet>
                <FieldLegend>How interested are you? *</FieldLegend>
                <FieldDescription>
                  Rate your interest from 1 (not interested) to 5 (very
                  interested).
                </FieldDescription>
                <RadioGroup
                  value={selectedInterestLevel}
                  onValueChange={(value) => setValue("interestLevel", value)}
                  className="mt-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      Not Interested
                    </span>
                    <div className="flex items-center gap-6">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Field
                          key={level}
                          orientation="vertical"
                          className="flex flex-col items-center gap-1.5"
                        >
                          <RadioGroupItem
                            value={level.toString()}
                            id={`interest-${level}`}
                          />
                          <FieldLabel
                            htmlFor={`interest-${level}`}
                            className="font-normal text-xs text-center px-1"
                          >
                            {level}
                          </FieldLabel>
                        </Field>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Very Interested
                    </span>
                  </div>
                </RadioGroup>
                {errors.interestLevel && (
                  <FieldError>{errors.interestLevel.message}</FieldError>
                )}
              </FieldSet>

              <FieldSeparator />

              {/* Price Points */}
              <FieldSet>
                <FieldLegend>What&apos;s a fair price point? *</FieldLegend>
                <FieldDescription>
                  Select all price ranges you&apos;d consider reasonable.
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group">
                  {priceOptions.map((option) => (
                    <Field key={option.id} orientation="horizontal">
                      <Checkbox
                        id={`price-${option.id}`}
                        checked={selectedPricePoints.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "pricePoints",
                            option.id,
                            !!checked
                          )
                        }
                      />
                      <FieldLabel
                        htmlFor={`price-${option.id}`}
                        className="font-normal cursor-pointer"
                      >
                        {option.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                {errors.pricePoints && (
                  <FieldError>{errors.pricePoints.message}</FieldError>
                )}
              </FieldSet>

              <FieldSeparator />

              {/* Other Sizes */}
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="otherSizes">
                      Other sizes you&apos;d want to see?
                    </FieldLabel>
                    <FieldDescription>
                      These pads will be 12&quot; x 22&quot;. Let us know if
                      you&apos;d prefer different dimensions.
                    </FieldDescription>
                    <Input
                      id="otherSizes"
                      placeholder='e.g., 36" x 18", XL desk mat'
                      {...register("otherSizes")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              {/* Email */}
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <FieldDescription>
                      Leave your email to follow the progress of this project
                      and get notified when we launch.
                    </FieldDescription>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <FieldError>{errors.email.message}</FieldError>
                    )}
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              {/* Suggestions */}
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="suggestions">
                      Any suggestions or comments?
                    </FieldLabel>
                    <FieldDescription>
                      We&apos;d love to hear your thoughts, ideas, or feedback.
                    </FieldDescription>
                    <Textarea
                      id="suggestions"
                      placeholder="Share your thoughts..."
                      className="min-h-[120px] resize-none"
                      {...register("suggestions")}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              {/* Submit Buttons */}
              <Field orientation="horizontal" className="pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </section>
      </div>
    </main>
  );
}
