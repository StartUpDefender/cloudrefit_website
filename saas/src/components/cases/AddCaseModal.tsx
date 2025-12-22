"use client";

import { useState, useEffect, FormEvent } from "react";
import { FiX, FiChevronDown, FiChevronUp, FiPlus, FiCalendar, FiSave, FiCheck } from "react-icons/fi";
import { Button, Input, Select } from "@/components/ui";
import { useTranslation, useLanguage } from "@/context/LanguageContext";
import { Alert } from "@/components/ui";

interface AddCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  caseData?: any | null;
  mode?: "add" | "edit";
}

type Opponent = {
  name: string;
  capacity: string;
};

type CaseFormData = {
  name: string;
  scopeOfWork: string;
  entryDate: string;
  clientName: string;
  clientStatus: string;
  details: string;
  priority: string;
  internalReferenceNumber: string;
  sharedWith: string;
  opponents: Opponent[];
  establishmentDate: string;
  dueDate: string;
  closingDate: string;
  estimatedDuration: string;
  referredVia: string;
  requestedBy: string;
  assignedTeam: string;
  assigned: string;
  additionalField1: string;
  additionalField2: string;
  additionalField3: string;
  additionalField4: string;
  additionalField5: string;
  additionalField6: string;
  entityName: string;
  hourlyRate: string;
  billingHourlyRate: string;
};

export default function AddCaseModal({
  isOpen,
  onClose,
  onSuccess,
  caseData,
  mode = "add",
}: AddCaseModalProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState<CaseFormData>({
    name: caseData?.name || "",
    scopeOfWork: caseData?.scopeOfWork || "",
    entryDate: caseData?.entryDate || "",
    clientName: caseData?.clientName || "",
    clientStatus: caseData?.clientStatus || "",
    details: caseData?.details || "",
    priority: caseData?.priority || "",
    internalReferenceNumber: caseData?.internalReferenceNumber || "",
    sharedWith: caseData?.sharedWith || "",
    opponents: caseData?.opponents || [{ name: "", capacity: "" }],
    establishmentDate: caseData?.establishmentDate || "",
    dueDate: caseData?.dueDate || "",
    closingDate: caseData?.closingDate || "",
    estimatedDuration: caseData?.estimatedDuration || "0",
    referredVia: caseData?.referredVia || "",
    requestedBy: caseData?.requestedBy || "",
    assignedTeam: caseData?.assignedTeam || "",
    assigned: caseData?.assigned || "",
    additionalField1: caseData?.additionalField1 || "",
    additionalField2: caseData?.additionalField2 || "",
    additionalField3: caseData?.additionalField3 || "",
    additionalField4: caseData?.additionalField4 || "",
    additionalField5: caseData?.additionalField5 || "",
    additionalField6: caseData?.additionalField6 || "",
    entityName: caseData?.entityName || "",
    hourlyRate: caseData?.hourlyRate || "",
    billingHourlyRate: caseData?.billingHourlyRate || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("generalInformation");

  // Section navigation items
  const sections = [
    { id: "generalInformation", label: t.cases.generalInformation },
    // { id: "moreDetails", label: t.cases.moreDetails },
    { id: "opponents", label: t.cases.opponents },
    { id: "datesAndTime", label: t.cases.datesAndTime },
    { id: "concernedPersons", label: t.cases.concernedPersons },
    { id: "customFields", label: t.cases.customFields },
    { id: "hourlyRate", label: t.cases.hourlyRate },
    { id: "billingPreferences", label: t.cases.billingPreferences },
  ];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = globalThis.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData({
      name: "",
      scopeOfWork: "",
      entryDate: "",
      clientName: "",
      clientStatus: "",
      details: "",
      priority: "",
      internalReferenceNumber: "",
      sharedWith: "",
      opponents: [{ name: "", capacity: "" }],
      establishmentDate: "",
      dueDate: "",
      closingDate: "",
      estimatedDuration: "0",
      referredVia: "",
      requestedBy: "",
      assignedTeam: "",
      assigned: "",
      additionalField1: "",
      additionalField2: "",
      additionalField3: "",
      additionalField4: "",
      additionalField5: "",
      additionalField6: "",
      entityName: "",
      hourlyRate: "",
      billingHourlyRate: "",
    });
    setErrors({});
    setError(null);
    setSuccess(false);
    setActiveSection("generalInformation");
    onClose();
  };

  const addOpponent = () => {
    setFormData({
      ...formData,
      opponents: [...formData.opponents, { name: "", capacity: "" }],
    });
  };

  const updateOpponent = (index: number, field: keyof Opponent, value: string) => {
    const updatedOpponents = [...formData.opponents];
    updatedOpponents[index] = { ...updatedOpponents[index], [field]: value };
    setFormData({ ...formData, opponents: updatedOpponents });
  };

  const removeOpponent = (index: number) => {
    if (formData.opponents.length > 1) {
      setFormData({
        ...formData,
        opponents: formData.opponents.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    const newErrors: Partial<Record<keyof CaseFormData, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = t.cases.required;
    }
    if (!formData.scopeOfWork.trim()) {
      newErrors.scopeOfWork = t.cases.required;
    }
    if (!formData.entryDate.trim()) {
      newErrors.entryDate = t.cases.required;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call
      // await createCase(formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || t.cases.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
        dir={isRTL ? "rtl" : "ltr"}
      />
      
      {/* Sidebar Modal */}
      <div
        className={`fixed top-0 bottom-0 z-50 w-full max-w-7xl overflow-hidden bg-white shadow-2xl ${isRTL ? "left-0 animate-slide-in-left" : "right-0 animate-slide-in-right"} h-full flex flex-row`}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Sidebar Navigation */}
        <div className={`w-64 border-slate-200 bg-slate-50 overflow-y-auto ${isRTL ? "border-l" : "border-r"}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {mode === "edit" ? t.cases.editCase : t.cases.addCase}
              </h2>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                aria-label={t.modals.close}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full px-4 py-3 text-sm font-medium rounded-lg transition ${
                    activeSection === section.id
                      ? "bg-[var(--brand)] text-white"
                      : "text-slate-700 hover:bg-slate-200"
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Action Buttons */}
          <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 z-10 shadow-sm">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <h3 className="text-lg font-semibold text-slate-900">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                {t.cases.cancel}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {/* Handle send notification */}}
                className="flex items-center gap-2"
              >
                <FiCheck className="h-4 w-4" />
                {t.cases.sendNotification}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {/* Handle save and create another */}}
                className="flex items-center gap-2"
              >
                <FiSave className="h-4 w-4" />
                {t.cases.saveAndCreateAnother}
              </Button>
              <Button
                type="submit"
                form="case-form"
                variant="primary"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <FiSave className="h-4 w-4" />
                {loading ? (isRTL ? "جاري الحفظ..." : "Saving...") : t.cases.save}
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form id="case-form" onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="error" message={error} />
              )}
              {success && (
                <Alert variant="success" message={mode === "edit" ? t.cases.updateSuccess || "Case updated successfully" : t.cases.createSuccess || "Case created successfully"} />
              )}

              {/* General Information Section */}
              {activeSection === "generalInformation" && (
                <div className="space-y-4">
                  <Input
                    id="name"
                    label={`${t.cases.name}*`}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    error={errors.name}
                    required
                  />

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        id="scopeOfWork"
                        label={`${t.cases.scopeOfWork}*`}
                        value={formData.scopeOfWork}
                        onChange={(e) => {
                          setFormData({ ...formData, scopeOfWork: e.target.value });
                          if (errors.scopeOfWork) setErrors({ ...errors, scopeOfWork: undefined });
                        }}
                        options={[
                          { value: "", label: t.cases.selectOption },
                        ]}
                        error={errors.scopeOfWork}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-8"
                      onClick={() => {/* Handle add scope of work */}}
                    >
                      <FiPlus className="h-4 w-4 mr-1" />
                      {t.cases.addScopeOfWork}
                    </Button>
                  </div>

                  <div className="relative">
                    <label htmlFor="entryDate" className={`block text-sm font-medium mb-2 ${errors.entryDate ? "text-rose-600" : "text-slate-700"}`}>
                      {t.cases.entryDate}*
                    </label>
                    <div className="relative">
                      <FiCalendar className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none z-10`} />
                      <input
                        id="entryDate"
                        type="date"
                        value={formData.entryDate}
                        onChange={(e) => {
                          setFormData({ ...formData, entryDate: e.target.value });
                          if (errors.entryDate) setErrors({ ...errors, entryDate: undefined });
                        }}
                        placeholder={isRTL ? "yyyy / mm / dd" : "mm / dd / yyyy"}
                        className={`w-full rounded-lg border ${errors.entryDate ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-200 focus:border-[var(--brand)] focus:ring-[var(--brand)]/20"} bg-white ${isRTL ? "pl-10 pr-12" : "pl-12 pr-10"} py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:shadow-md`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("entryDate") as HTMLInputElement;
                          input?.showPicker?.();
                        }}
                        className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600 transition cursor-pointer`}
                        aria-label="Open date picker"
                      >
                        <FiCalendar className="h-5 w-5" />
                      </button>
                    </div>
                    {errors.entryDate && (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.entryDate}</p>
                    )}
                  </div>

                  <Input
                    id="clientName"
                    label={t.cases.clientName}
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder={t.cases.clientName}
                  />

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        id="clientStatus"
                        label={t.cases.clientStatus}
                        value={formData.clientStatus}
                        onChange={(e) => setFormData({ ...formData, clientStatus: e.target.value })}
                        options={[
                          { value: "", label: t.cases.selectOption },
                        ]}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-8"
                      onClick={() => {/* Handle add client status */}}
                    >
                      <FiPlus className="h-4 w-4 mr-1" />
                      {t.cases.addClientStatus}
                    </Button>
                  </div>

                  <div>
                    <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-2">
                      {t.cases.details}
                    </label>
                    <textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 focus:outline-none"
                      rows={4}
                      placeholder={t.cases.details}
                    />
                  </div>

                  <Select
                    id="priority"
                    label={t.cases.priority}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    options={[
                      { value: "", label: t.cases.selectOption },
                      { value: "low", label: isRTL ? "أولوية منخفضة" : "Low Priority" },
                      { value: "medium", label: isRTL ? "درجة متوسطة" : "Medium Priority" },
                      { value: "high", label: isRTL ? "أولوية عالية" : "High Priority" },
                    ]}
                  />

                  <Input
                    id="internalReferenceNumber"
                    label={t.cases.internalReferenceNumber}
                    value={formData.internalReferenceNumber}
                    onChange={(e) => setFormData({ ...formData, internalReferenceNumber: e.target.value })}
                    placeholder={t.cases.internalReferenceNumber}
                  />

                  <Input
                    id="sharedWith"
                    label={t.cases.sharedWith}
                    value={formData.sharedWith}
                    onChange={(e) => setFormData({ ...formData, sharedWith: e.target.value })}
                    placeholder={t.cases.everyone}
                  />
                </div>
              )}

              {/* Opponents Section */}
              {activeSection === "opponents" && (
                <div className="space-y-6">
                  {formData.opponents.map((opponent, index) => (
                    <div key={`opponent-${index}-${opponent.name || index}`} className="border border-slate-200 rounded-lg p-4 space-y-4">
                      {formData.opponents.length > 1 && (
                        <div className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                          <h4 className="text-sm font-semibold text-slate-700">
                            {isRTL ? `الخصم ${index + 1}` : `Opponent ${index + 1}`}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeOpponent(index)}
                            className="text-rose-500 hover:text-rose-700 text-sm"
                          >
                            {isRTL ? "حذف" : "Remove"}
                          </button>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {t.cases.opponentName}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            id={`opponent-name-${index}`}
                            value={opponent.name}
                            onChange={(e) => updateOpponent(index, "name", e.target.value)}
                            placeholder={t.cases.clientName}
                          />
                          <Select
                            id={`opponent-select-${index}`}
                            value=""
                            onChange={() => {}}
                            options={[
                              { value: "", label: t.cases.startTyping },
                            ]}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {t.cases.opponentCapacity}
                        </label>
                        <Select
                          id={`opponent-capacity-${index}`}
                          value={opponent.capacity}
                          onChange={(e) => updateOpponent(index, "capacity", e.target.value)}
                          options={[
                            { value: "", label: t.cases.selectOption },
                          ]}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOpponent}
                    className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <FiPlus className="h-4 w-4" />
                    {t.cases.addOpponent}
                  </Button>
                </div>
              )}

              {/* Dates and Time Section */}
              {activeSection === "datesAndTime" && (
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="establishmentDate" className="block text-sm font-medium text-slate-700 mb-2">
                      {t.cases.establishmentDate}
                    </label>
                    <div className="relative">
                      <FiCalendar className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none z-10`} />
                      <input
                        id="establishmentDate"
                        type="date"
                        value={formData.establishmentDate}
                        onChange={(e) => setFormData({ ...formData, establishmentDate: e.target.value })}
                        placeholder={isRTL ? "yyyy / mm / dd" : "mm / dd / yyyy"}
                        className={`w-full rounded-lg border border-slate-200 bg-white ${isRTL ? "pl-10 pr-12" : "pl-12 pr-10"} py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 focus:outline-none focus:shadow-md`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("establishmentDate") as HTMLInputElement;
                          input?.showPicker?.();
                        }}
                        className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600 transition cursor-pointer`}
                        aria-label="Open date picker"
                      >
                        <FiCalendar className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
                      {t.cases.dueDate}
                    </label>
                    <div className="relative">
                      <FiCalendar className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none z-10`} />
                      <input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        placeholder={isRTL ? "yyyy / mm / dd" : "mm / dd / yyyy"}
                        className={`w-full rounded-lg border border-slate-200 bg-white ${isRTL ? "pl-10 pr-12" : "pl-12 pr-10"} py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 focus:outline-none focus:shadow-md`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("dueDate") as HTMLInputElement;
                          input?.showPicker?.();
                        }}
                        className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600 transition cursor-pointer`}
                        aria-label="Open date picker"
                      >
                        <FiCalendar className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="closingDate" className="block text-sm font-medium text-slate-700 mb-2">
                      {t.cases.closingDate}
                    </label>
                    <div className="relative">
                      <FiCalendar className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none z-10`} />
                      <input
                        id="closingDate"
                        type="date"
                        value={formData.closingDate}
                        onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                        placeholder={isRTL ? "yyyy / mm / dd" : "mm / dd / yyyy"}
                        className={`w-full rounded-lg border border-slate-200 bg-white ${isRTL ? "pl-10 pr-12" : "pl-12 pr-10"} py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 focus:outline-none focus:shadow-md`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("closingDate") as HTMLInputElement;
                          input?.showPicker?.();
                        }}
                        className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-slate-600 transition cursor-pointer`}
                        aria-label="Open date picker"
                      >
                        <FiCalendar className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <Input
                    id="estimatedDuration"
                    label={t.cases.estimatedDuration}
                    type="number"
                    value={formData.estimatedDuration}
                    onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                    placeholder="0"
                  />
                </div>
              )}

              {/* Concerned Persons Section */}
              {activeSection === "concernedPersons" && (
                <div className="space-y-4">
                  <Input
                    id="referredVia"
                    label={t.cases.referredVia}
                    value={formData.referredVia}
                    onChange={(e) => setFormData({ ...formData, referredVia: e.target.value })}
                    placeholder={t.cases.startTyping}
                  />

                  <Input
                    id="requestedBy"
                    label={t.cases.requestedBy}
                    value={formData.requestedBy}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                    placeholder={t.cases.startTyping}
                  />

                  <Select
                    id="assignedTeam"
                    label={t.cases.assignedTeam}
                    value={formData.assignedTeam}
                    onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
                    options={[
                      { value: "", label: t.cases.selectOption },
                      { value: "legal", label: t.cases.legalTeam },
                    ]}
                  />

                  <Input
                    id="assigned"
                    label={t.cases.assigned}
                    value={formData.assigned}
                    onChange={(e) => setFormData({ ...formData, assigned: e.target.value })}
                    placeholder={t.cases.startTyping}
                  />
                </div>
              )}

              {/* Custom Fields Section */}
              {activeSection === "customFields" && (
                <div className="space-y-4">
                  <Input
                    id="additionalField1"
                    label={`${t.cases.additionalField} 1`}
                    value={formData.additionalField1}
                    onChange={(e) => setFormData({ ...formData, additionalField1: e.target.value })}
                  />
                  <Input
                    id="additionalField2"
                    label={`${t.cases.additionalField} 2`}
                    value={formData.additionalField2}
                    onChange={(e) => setFormData({ ...formData, additionalField2: e.target.value })}
                  />
                  <Input
                    id="additionalField3"
                    label={`${t.cases.additionalField} 3`}
                    value={formData.additionalField3}
                    onChange={(e) => setFormData({ ...formData, additionalField3: e.target.value })}
                  />
                  <Input
                    id="additionalField4"
                    label={`${t.cases.additionalField} 4`}
                    value={formData.additionalField4}
                    onChange={(e) => setFormData({ ...formData, additionalField4: e.target.value })}
                  />
                  <Input
                    id="additionalField5"
                    label={`${t.cases.additionalField} 5`}
                    value={formData.additionalField5}
                    onChange={(e) => setFormData({ ...formData, additionalField5: e.target.value })}
                  />
                  <Input
                    id="additionalField6"
                    label={`${t.cases.additionalField} 6`}
                    value={formData.additionalField6}
                    onChange={(e) => setFormData({ ...formData, additionalField6: e.target.value })}
                  />
                </div>
              )}

              {/* Hourly Rate Section */}
              {activeSection === "hourlyRate" && (
                <div className="space-y-4">
                  <Select
                    id="entityName"
                    label={t.cases.entityName}
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    options={[
                      { value: "", label: t.cases.selectOption },
                    ]}
                  />
                  <Input
                    id="hourlyRate"
                    label={t.cases.rate}
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    placeholder={t.cases.rate}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {/* Handle add price for organization */}}
                    className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <FiPlus className="h-4 w-4" />
                    {t.cases.addPriceForOrganization}
                  </Button>
                </div>
              )}

              {/* Billing Preferences Section */}
              {activeSection === "billingPreferences" && (
                <div className="space-y-4">
                  <Select
                    id="billingHourlyRate"
                    label={t.cases.hourlyRateBilling}
                    value={formData.billingHourlyRate}
                    onChange={(e) => setFormData({ ...formData, billingHourlyRate: e.target.value })}
                    options={[
                      { value: "", label: t.cases.hourlyRateBilling },
                    ]}
                  />
                </div>
              )}

              {/* Other sections - placeholder */}
              {activeSection !== "generalInformation" && activeSection !== "opponents" && activeSection !== "datesAndTime" && activeSection !== "concernedPersons" && activeSection !== "customFields" && activeSection !== "hourlyRate" && activeSection !== "billingPreferences" && (
                <div className="text-center py-12 text-slate-500">
                  <p>{sections.find(s => s.id === activeSection)?.label}</p>
                  <p className="text-sm mt-2">{t.navbar.comingSoon}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

