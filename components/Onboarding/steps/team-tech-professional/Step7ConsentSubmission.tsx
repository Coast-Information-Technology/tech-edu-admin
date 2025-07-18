import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, Shield } from "lucide-react";

interface Step7ConsentSubmissionProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export function Step7ConsentSubmission({
  form,
  errors,
  handleChange,
}: Step7ConsentSubmissionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <div className="flex items-center space-x-3 mb-3">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          <h4 className="font-medium text-blue-900">Final Review & Consent</h4>
        </div>
        <p className="text-sm text-blue-800">
          Please review all the information you've provided and give your
          consent to proceed with the team onboarding process.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-[10px] p-4">
        <h4 className="font-medium text-green-900 mb-3">Onboarding Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-green-800">Team Lead:</p>
            <p className="text-green-700">
              {form.teamLeadFullName || "Not provided"}
            </p>
          </div>
          <div>
            <p className="font-medium text-green-800">Company:</p>
            <p className="text-green-700">
              {form.companyName || "Not provided"}
            </p>
          </div>
          <div>
            <p className="font-medium text-green-800">Team Name:</p>
            <p className="text-green-700">{form.teamName || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium text-green-800">Team Size:</p>
            <p className="text-green-700">
              {form.teamSize || "Not provided"} members
            </p>
          </div>
          <div>
            <p className="font-medium text-green-800">Primary Goal:</p>
            <p className="text-green-700">{form.goalType || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium text-green-800">Timeline:</p>
            <p className="text-green-700">
              {form.trainingTimeline || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consentToTerms"
            name="consentToTerms"
            checked={form.consentToTerms}
            onCheckedChange={(checked) => {
              const event = {
                target: {
                  name: "consentToTerms",
                  type: "checkbox",
                  checked: checked as boolean,
                },
              } as any;
              handleChange(event);
            }}
            className="mt-1"
          />
          <div className="flex-1">
            <Label
              htmlFor="consentToTerms"
              className="text-sm font-medium text-gray-700"
            >
              I agree to the Terms and Conditions *
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              I have read and agree to the platform's terms of service, privacy
              policy, and data processing agreements. I understand that my
              team's information will be used to provide customized training
              services.
            </p>
            {errors.consentToTerms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.consentToTerms}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="teamAcknowledged"
            name="teamAcknowledged"
            checked={form.teamAcknowledged}
            onCheckedChange={(checked) => {
              const event = {
                target: {
                  name: "teamAcknowledged",
                  type: "checkbox",
                  checked: checked as boolean,
                },
              } as any;
              handleChange(event);
            }}
            className="mt-1"
          />
          <div className="flex-1">
            <Label
              htmlFor="teamAcknowledged"
              className="text-sm font-medium text-gray-700"
            >
              Team Acknowledgment *
            </Label>
            <p className="text-xs text-gray-600 mt-1">
              I confirm that I have the authority to represent this team and
              that all team members have been informed about this onboarding
              process. I understand that team members will receive invitations
              to join the platform.
            </p>
            {errors.teamAcknowledged && (
              <p className="text-red-500 text-xs mt-1">
                {errors.teamAcknowledged}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
        <div className="flex items-center space-x-3 mb-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-900">Important Information</h4>
        </div>
        <ul className="text-sm text-yellow-800 space-y-2">
          <li>
            • Your team information will be reviewed by our team within 2-3
            business days
          </li>
          <li>
            • Team members will receive email invitations to join the platform
          </li>
          <li>
            • A personalized learning plan will be created based on your team's
            needs
          </li>
          <li>
            • You'll receive access to training resources and mentorship
            programs
          </li>
          <li>• Regular progress updates and support will be provided</li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Shield className="w-5 h-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">Data Protection</h4>
        </div>
        <p className="text-sm text-gray-700">
          Your team's data is protected under our comprehensive privacy policy.
          We use industry-standard security measures to ensure the
          confidentiality and integrity of all information provided during the
          onboarding process.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Next Steps After Submission
        </h4>
        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
          <li>Review of your team's information by our experts</li>
          <li>Creation of a customized learning plan</li>
          <li>Invitation emails sent to team members</li>
          <li>Access to training resources and programs</li>
          <li>Ongoing support and progress tracking</li>
        </ol>
      </div>
    </div>
  );
}
