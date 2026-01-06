"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { submitContactMessage } from "@/lib/services/contact";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    try {
      await submitContactMessage(data);
      setIsSubmitted(true);
      toast.success("Message sent!", {
        description: "We'll get back to you as soon as possible.",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewMessage() {
    setIsSubmitted(false);
    reset();
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="py-16 px-4 sm:px-6 text-center border-b">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
          Contact
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MessageCircle
                    className="h-5 w-5 mt-0.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-medium">Discord</h3>
                    <p className="text-sm text-muted-foreground">@p8pr</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin
                    className="h-5 w-5 mt-0.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      San Jose, California
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Clock
                    className="h-5 w-5 mt-0.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-medium">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      Within 24-48 hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6 sm:p-8">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-6">
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thanks for reaching out. We&apos;ll get back to you within
                    24-48 hours.
                  </p>
                  <Button onClick={handleNewMessage} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FieldSet>
                        <Field>
                          <FieldLabel htmlFor="name">Name *</FieldLabel>
                          <Input
                            id="name"
                            placeholder="Your name"
                            autoComplete="name"
                            aria-invalid={!!errors.name}
                            {...register("name")}
                          />
                          {errors.name && (
                            <FieldError>{errors.name.message}</FieldError>
                          )}
                        </Field>
                      </FieldSet>

                      <FieldSet>
                        <Field>
                          <FieldLabel htmlFor="email">Email *</FieldLabel>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            {...register("email")}
                          />
                          {errors.email && (
                            <FieldError>{errors.email.message}</FieldError>
                          )}
                        </Field>
                      </FieldSet>
                    </div>

                    <FieldSet>
                      <Field>
                        <FieldLabel htmlFor="subject">Subject *</FieldLabel>
                        <Input
                          id="subject"
                          placeholder="What's this about?"
                          aria-invalid={!!errors.subject}
                          {...register("subject")}
                        />
                        {errors.subject && (
                          <FieldError>{errors.subject.message}</FieldError>
                        )}
                      </Field>
                    </FieldSet>

                    <FieldSet>
                      <Field>
                        <FieldLabel htmlFor="message">Message *</FieldLabel>
                        <FieldDescription>
                          Tell us how we can help you.
                        </FieldDescription>
                        <Textarea
                          id="message"
                          placeholder="Your message..."
                          className="min-h-[150px] resize-none"
                          aria-invalid={!!errors.message}
                          {...register("message")}
                        />
                        {errors.message && (
                          <FieldError>{errors.message.message}</FieldError>
                        )}
                      </Field>
                    </FieldSet>

                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
