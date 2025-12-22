"use client";

import { useState, useEffect, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import Topbar from "@/components/layout/Topbar";
import AddLawyerModal from "@/components/lawyers/AddLawyerModal";
import ViewLawyerModal from "@/components/lawyers/ViewLawyerModal";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import DataTable from "@/components/clients/DataTable";

// Import Column type from DataTable
type Column = {
  id: string;
  label: string;
  accessor: string;
  width?: number;
  minWidth?: number;
};
import { Button, Alert } from "@/components/ui";
import { useTranslation, useLanguage } from "@/context/LanguageContext";
import { getLawyers, deleteLawyer, type Lawyer } from "@/lib/services/lawyers";
import mockLawyersData from "@/data/mockLawyers.json";

export default function LawyersPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Base column definitions with default widths
  const baseColumns = useMemo(() => [
    { id: "firstName", accessor: "firstName", width: 150, minWidth: 100 },
    { id: "lastName", accessor: "lastName", width: 150, minWidth: 100 },
    { id: "fullName", accessor: "fullName", width: 200, minWidth: 150 },
    { id: "category", accessor: "category", width: 150, minWidth: 100 },
    { id: "subCategory", accessor: "subCategory", width: 150, minWidth: 100 },
    { id: "jobTitle", accessor: "jobTitle", width: 150, minWidth: 100 },
    { id: "company", accessor: "company", width: 150, minWidth: 100 },
    { id: "city", accessor: "city", width: 150, minWidth: 100 },
    { id: "country", accessor: "country", width: 150, minWidth: 100 },
    { id: "email", accessor: "email", width: 200, minWidth: 150 },
    { id: "mobile", accessor: "mobile", width: 150, minWidth: 100 },
    { id: "phone", accessor: "phone", width: 150, minWidth: 100 },
  ], []);

  // Columns with localized labels - updates when language changes
  const columnsWithLabels = useMemo(() => {
    const labelMap: Record<string, string> = {
      firstName: t.lawyers.firstName,
      lastName: t.lawyers.lastName,
      fullName: t.lawyers.fullName,
      category: t.lawyers.category,
      subCategory: t.lawyers.subCategory,
      jobTitle: t.lawyers.jobTitle,
      company: t.lawyers.company,
      city: t.lawyers.city,
      country: t.lawyers.country,
      email: t.lawyers.email,
      mobile: t.lawyers.mobile,
      phone: t.lawyers.phone,
    };
    return baseColumns.map((col) => ({
      ...col,
      label: labelMap[col.id] || col.id,
    }));
  }, [baseColumns, language, t.lawyers.firstName, t.lawyers.lastName, t.lawyers.fullName, t.lawyers.category, t.lawyers.subCategory, t.lawyers.jobTitle, t.lawyers.company, t.lawyers.city, t.lawyers.country, t.lawyers.email, t.lawyers.mobile, t.lawyers.phone]);

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
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLawyers();
      // If API returns empty array or fails, use mock data
      if (data && data.length > 0) {
        setLawyers(data);
      } else {
        // Use mock data as fallback
        setLawyers(mockLawyersData as Lawyer[]);
      }
    } catch (err: any) {
      // On error, use mock data
      console.warn("Failed to fetch lawyers from API, using mock data:", err);
      setLawyers(mockLawyersData as Lawyer[]);
      // Don't show error if we have mock data
      // setError(err.message || t.lawyers.error);
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
    fetchLawyers();
  };

  // Calculate pagination
  const totalItems = lawyers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = lawyers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
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
              {t.lawyers.title}
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-slate-600">
              {t.lawyers.title}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <FiPlus className="h-4 w-4" />
            <span>{t.lawyers.addLawyer}</span>
          </Button>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert variant="error" message={error} />
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm p-0   border border-slate-300 animate-fade-in overflow-hidden">
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
            getRowId={(lawyer) => lawyer.id || `${lawyer.firstName}-${lawyer.lastName}`}
            onEdit={(lawyer) => {
              setSelectedLawyer(lawyer);
              setIsModalOpen(true);
            }}
            onDelete={(lawyer) => {
              setSelectedLawyer(lawyer);
              setIsDeleteModalOpen(true);
            }}
            onView={(lawyer) => {
              setSelectedLawyer(lawyer);
              setIsViewModalOpen(true);
            }}
          />
        </div>
      </main>

      {/* Add/Edit Lawyer Modal */}
      <AddLawyerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLawyer(null);
        }}
        onSuccess={handleAddSuccess}
        lawyer={selectedLawyer}
        mode={selectedLawyer ? "edit" : "add"}
      />

      {/* View Lawyer Modal */}
      <ViewLawyerModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedLawyer(null);
        }}
        lawyer={selectedLawyer}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLawyer(null);
        }}
        onConfirm={async () => {
          if (selectedLawyer?.id) {
            setDeleteLoading(true);
            try {
              await deleteLawyer(selectedLawyer.id);
              setIsDeleteModalOpen(false);
              setSelectedLawyer(null);
              fetchLawyers();
            } catch (err: any) {
              setError(err.message || t.lawyers.deleteError);
            } finally {
              setDeleteLoading(false);
            }
          }
        }}
        itemName={`${selectedLawyer?.firstName} ${selectedLawyer?.lastName}`}
        loading={deleteLoading}
      />
    </div>
  );
}

