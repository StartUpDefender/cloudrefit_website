"use client";

import { useState, useEffect, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import Topbar from "@/components/layout/Topbar";
import AddCaseModal from "@/components/cases/AddCaseModal";
import DataTable from "@/components/clients/DataTable";
import { Button, Alert } from "@/components/ui";
import { useTranslation, useLanguage } from "@/context/LanguageContext";

// Import Column type from DataTable
type Column = {
  id: string;
  label: string;
  accessor: string;
  width?: number;
  minWidth?: number;
};

type Case = {
  id?: string;
  name: string;
  scopeOfWork: string;
  entryDate: string;
  clientName: string;
  priority: string;
  status?: string;
};

export default function CasesPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Base column definitions with default widths
  const baseColumns = useMemo(() => [
    { id: "name", accessor: "name", width: 200, minWidth: 150 },
    { id: "scopeOfWork", accessor: "scopeOfWork", width: 150, minWidth: 100 },
    { id: "entryDate", accessor: "entryDate", width: 150, minWidth: 100 },
    { id: "clientName", accessor: "clientName", width: 150, minWidth: 100 },
    { id: "priority", accessor: "priority", width: 120, minWidth: 100 },
  ], []);

  // Columns with localized labels - updates when language changes
  const columnsWithLabels = useMemo(() => {
    const labelMap: Record<string, string> = {
      name: t.cases.name,
      scopeOfWork: t.cases.scopeOfWork,
      entryDate: t.cases.entryDate,
      clientName: t.cases.clientName,
      priority: t.cases.priority,
    };
    return baseColumns.map((col) => ({
      ...col,
      label: labelMap[col.id] || col.id,
    }));
  }, [baseColumns, language, t.cases.name, t.cases.scopeOfWork, t.cases.entryDate, t.cases.clientName, t.cases.priority]);

  const [columns, setColumns] = useState(columnsWithLabels);

  // Update column labels when language changes, preserving widths
  useEffect(() => {
    setColumns((prevColumns) => 
      columnsWithLabels.map((newCol, index) => ({
        ...newCol,
        width: prevColumns[index]?.width || newCol.width,
      }))
    );
  }, [columnsWithLabels]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement API call
      // const data = await getCases();
      // setCases(data);
      setCases([]); // Placeholder
    } catch (err: any) {
      setError(err.message || t.cases.error);
    } finally {
      setLoading(false);
    }
  };

  const handleColumnReorder = (newColumns: Column[]) => {
    setColumns(newColumns.map((col) => ({
      id: col.id,
      label: col.label,
      accessor: col.accessor,
      width: col.width ?? 150,
      minWidth: col.minWidth ?? 100,
    })));
  };

  const handleColumnResize = (columnId: string, width: number) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, width } : col
      )
    );
  };

  const handleAddSuccess = () => {
    fetchCases();
  };

  // Calculate pagination
  const totalItems = cases.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = cases.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Topbar />

      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 px-4 py-4 md:px-6 md:py-6">
        {/* Header */}
        <section className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              {t.cases.title}
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-slate-600">
              {t.cases.title}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <FiPlus className="h-4 w-4" />
            <span>{t.cases.addCase}</span>
          </Button>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert variant="error" message={error} />
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm p-0 animate-fade-in overflow-hidden">
          <DataTable
            columns={columns}
            data={paginatedData}
            loading={loading}
            onColumnReorder={handleColumnReorder}
            onColumnResize={handleColumnResize}
            pagination={
              totalItems > 0
                ? {
                    currentPage,
                    totalPages,
                    totalItems,
                    itemsPerPage,
                    onPageChange: handlePageChange,
                    onItemsPerPageChange: handleItemsPerPageChange,
                  }
                : undefined
            }
            onEdit={(caseItem) => {
              setSelectedCase(caseItem);
              setIsModalOpen(true);
            }}
            onDelete={(caseItem) => {
              // Handle delete
              console.log("Delete case:", caseItem);
            }}
            onView={(caseItem) => {
              // Handle view
              console.log("View case:", caseItem);
            }}
          />
        </div>
      </main>

      {/* Add/Edit Case Modal */}
      <AddCaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCase(null);
        }}
        onSuccess={handleAddSuccess}
        caseData={selectedCase}
        mode={selectedCase ? "edit" : "add"}
      />
    </div>
  );
}




