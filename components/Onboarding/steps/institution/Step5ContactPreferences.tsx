import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Phone, MessageSquare } from "lucide-react";

interface Step5ContactPreferencesProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const contactMethods = [
  {
    value: "email",
    label: "Email",
    description: "Receive updates and notifications via email",
    icon: Mail,
  },
  {
    value: "phone",
    label: "Phone",
    description: "Receive important updates via phone calls",
    icon: Phone,
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    description: "Receive updates via WhatsApp messages",
    icon: MessageSquare,
  },
];

export default function Step5ContactPreferences({
  form,
  errors,
  handleChange,
}: Step5ContactPreferencesProps) {
  const handleRadioChange = (value: string) => {
    handleChange({
      target: { name: "preferredContactMethod", value },
    } as any);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          How would you prefer to receive important updates and communications?
        </p>
      </div>

      <div className="space-y-4">
        <RadioGroup
          value={form.preferredContactMethod}
          onValueChange={handleRadioChange}
          className="space-y-4"
        >
          {contactMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <div
                key={method.value}
                className={`flex items-start space-x-3 p-4 rounded-[10px] border-2 cursor-pointer transition-colors ${
                  form.preferredContactMethod === method.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleRadioChange(method.value)}
              >
                <RadioGroupItem
                  value={method.value}
                  id={method.value}
                  className="mt-1"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <Label
                      htmlFor={method.value}
                      className="text-base font-medium cursor-pointer"
                    >
                      {method.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </RadioGroup>

        {errors.preferredContactMethod && (
          <p className="text-red-500 text-sm">
            {errors.preferredContactMethod}
          </p>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-blue-900 mb-2">
          What you'll receive:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Platform updates and new features</li>
          <li>• Student progress reports and analytics</li>
          <li>• Training program announcements</li>
          <li>• Career opportunity notifications</li>
          <li>• Important compliance and policy updates</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-4 rounded-[10px]">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> You can change your contact preferences anytime
          in your account settings. We respect your privacy and will never share
          your contact information with third parties.
        </p>
      </div>
    </div>
  );
}
