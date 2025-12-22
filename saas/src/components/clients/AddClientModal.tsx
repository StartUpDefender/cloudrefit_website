"use client";

import { useState, useEffect, FormEvent } from "react";
import { FiX } from "react-icons/fi";
import { Button, Input, Select, Radio } from "@/components/ui";
import { useTranslation } from "@/context/LanguageContext";
import { useLanguage } from "@/context/LanguageContext";
import { createClient, updateClient, type CreateClientRequest, type Client } from "@/lib/services/clients";
import { Alert } from "@/components/ui";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: Client | null;
  mode?: "add" | "edit";
}

export default function AddClientModal({
  isOpen,
  onClose,
  onSuccess,
  client,
  mode = "add",
}: AddClientModalProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState<CreateClientRequest>({
    clientType: "company",
    companyName: "",
    shortName: "",
    subCategory: "",
    city: "",
    country: "",
    website: "",
    mobile: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateClientRequest, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update form data when client prop changes
  useEffect(() => {
    if (client && mode === "edit") {
      setFormData({
        clientType: client.clientType || "company",
        companyName: client.companyName || "",
        shortName: client.shortName || "",
        subCategory: client.subCategory || "",
        city: client.city || "",
        country: client.country || "",
        website: client.website || "",
        mobile: client.mobile || "",
        phone: client.phone || "",
        email: client.email || "",
      });
    }
  }, [client, mode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    const newErrors: Partial<Record<keyof CreateClientRequest, string>> = {};
    if (!formData.companyName?.trim()) {
      newErrors.companyName = t.clients.required;
    }
    if (!formData.shortName?.trim()) {
      newErrors.shortName = t.clients.required;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (mode === "edit" && client?.id) {
        await updateClient({ id: client.id, ...formData });
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      } else {
        await createClient(formData);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || (mode === "edit" ? t.clients.updateError : t.clients.createError));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      clientType: "company",
      companyName: "",
      shortName: "",
      subCategory: "",
      city: "",
      country: "",
      website: "",
      mobile: "",
      phone: "",
      email: "",
    });
    setErrors({});
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl m-4 animate-scale-in ${isRTL ? "animate-slide-in-left" : "animate-slide-in-right"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 z-10">
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === "edit" ? t.clients.editClient : t.clients.addClient}
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label={t.modals.close}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <Alert variant="error" message={error} />
          )}
          {success && (
            <Alert variant="success" message={mode === "edit" ? t.clients.updateSuccess : t.clients.createSuccess} />
          )}

          {/* Client Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              {t.clients.clientType}
            </label>
            <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Radio
                id="client-type-company"
                name="clientType"
                value="company"
                label={t.clients.company}
                checked={formData.clientType === "company"}
                onChange={(e) =>
                  setFormData({ ...formData, clientType: e.target.value as "company" | "person" })
                }
              />
              <Radio
                id="client-type-person"
                name="clientType"
                value="person"
                label={t.clients.person}
                checked={formData.clientType === "person"}
                onChange={(e) =>
                  setFormData({ ...formData, clientType: e.target.value as "company" | "person" })
                }
              />
            </div>
          </div>

          {/* Company Name */}
          <Input
            id="companyName"
            label={t.clients.companyName}
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            error={errors.companyName}
            required
          />

          {/* Short Name */}
          <Input
            id="shortName"
            label={t.clients.shortName}
            value={formData.shortName}
            onChange={(e) =>
              setFormData({ ...formData, shortName: e.target.value })
            }
            error={errors.shortName}
            required
          />

          {/* Sub Category */}
          <Select
            id="subCategory"
            label={t.clients.subCategory}
            value={formData.subCategory || ""}
            onChange={(e) =>
              setFormData({ ...formData, subCategory: e.target.value })
            }
            options={[
              { value: "", label: t.clients.none },
            ]}
          />

          {/* City */}
          <Input
            id="city"
            label={t.clients.city}
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
          />

          {/* Country */}
          <Select
            id="country"
            label={t.clients.country}
            value={formData.country || ""}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            options={[
              { value: "", label: t.clients.none },
            ]}
          />

          {/* Website */}
          <Input
            id="website"
            label={t.clients.website}
            type="url"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
          />

          {/* Mobile */}
          <Input
            id="mobile"
            label={t.clients.mobile}
            type="tel"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
          />

          {/* Phone */}
          <Input
            id="phone"
            label={t.clients.phone}
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          {/* Email */}
          <Input
            id="email"
            label={t.clients.email}
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            helperText={t.clients.emailHelper}
          />

          {/* Actions */}
          <div className={`flex gap-3 pt-4 border-t border-slate-200 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t.clients.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading
                ? isRTL
                  ? mode === "edit"
                    ? "جاري التحديث..."
                    : "جاري الحفظ..."
                  : mode === "edit"
                  ? "Updating..."
                  : "Saving..."
                : mode === "edit"
                ? t.clients.updateSuccess
                : t.clients.save}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

