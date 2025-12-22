"use client";

import { useState, useEffect, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import Topbar from "@/components/layout/Topbar";
import AddPersonModal from "@/components/people/AddPersonModal";
import ViewPersonModal from "@/components/people/ViewPersonModal";
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
import { getPeople, deletePerson, type Person, type PaginatedResponse } from "@/lib/services/people";

export default function PeoplePage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState<{
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  }>({
    totalDocs: 0,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });

  // Base column definitions with default widths
  const baseColumns = useMemo(() => [
    { id: "firstName", accessor: "firstName", width: 150, minWidth: 100 },
    { id: "lastName", accessor: "lastName", width: 150, minWidth: 100 },
    { id: "fullName", accessor: "fullName", width: 200, minWidth: 150 },
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
      firstName: t.people.firstName,
      lastName: t.people.lastName,
      fullName: t.people.fullName,
      jobTitle: t.people.jobTitle,
      company: t.people.company,
      city: t.people.city,
      country: t.people.country,
      email: t.people.email,
      mobile: t.people.mobile,
      phone: t.people.phone,
    };
    return baseColumns.map((col) => ({
      ...col,
      label: labelMap[col.id] || col.id,
    }));
  }, [baseColumns, language, t.people.firstName, t.people.lastName, t.people.fullName, t.people.jobTitle, t.people.company, t.people.city, t.people.country, t.people.email, t.people.mobile, t.people.phone]);

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
    fetchPeople();
  }, [currentPage, itemsPerPage]);

  const fetchPeople = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Person> = await getPeople(currentPage, itemsPerPage);
      
      // Set people data from docs array
      setPeople(response.docs || []);
      
      // Set pagination info from API response
      setPaginationInfo({
        totalDocs: response.totalDocs || 0,
        totalPages: response.totalPages || 1,
        hasPrevPage: response.hasPrevPage || false,
        hasNextPage: response.hasNextPage || false,
      });
      
      // Update current page if API returned different page
      if (response.page && response.page !== currentPage) {
        setCurrentPage(response.page);
      }
    } catch (err: any) {
      // On error, show empty state
      console.error("Failed to fetch people from API:", err);
      setPeople([]);
      setError(err.message || t.people.error);
      setPaginationInfo({
        totalDocs: 0,
        totalPages: 1,
        hasPrevPage: false,
        hasNextPage: false,
      });
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
    fetchPeople();
  };

  // Use pagination info from API response
  const totalItems = paginationInfo.totalDocs;
  const totalPages = paginationInfo.totalPages;
  // Data is already paginated from API, no need to slice
  const paginatedData = people;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: "smooth" });
    // fetchPeople will be called automatically via useEffect
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    // fetchPeople will be called automatically via useEffect
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
              {t.people.title}
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-slate-600">
              {t.people.title}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <FiPlus className="h-4 w-4" />
            <span>{t.people.addPerson}</span>
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
            onEdit={(person) => {
              setSelectedPerson(person);
              setIsModalOpen(true);
            }}
            onDelete={(person) => {
              setSelectedPerson(person);
              setIsDeleteModalOpen(true);
            }}
            onView={(person) => {
              setSelectedPerson(person);
              setIsViewModalOpen(true);
            }}
          />
        </div>
      </main>

      {/* Add/Edit Person Modal */}
      <AddPersonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPerson(null);
        }}
        onSuccess={handleAddSuccess}
        person={selectedPerson}
        mode={selectedPerson ? "edit" : "add"}
      />

      {/* View Person Modal */}
      <ViewPersonModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedPerson(null);
        }}
        person={selectedPerson}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPerson(null);
        }}
        onConfirm={async () => {
          if (selectedPerson?.id) {
            setDeleteLoading(true);
            try {
              await deletePerson(selectedPerson.id);
              setIsDeleteModalOpen(false);
              setSelectedPerson(null);
              fetchPeople();
            } catch (err: any) {
              setError(err.message || t.people.deleteError);
            } finally {
              setDeleteLoading(false);
            }
          }
        }}
        itemName={`${selectedPerson?.firstName} ${selectedPerson?.lastName}`}
        loading={deleteLoading}
      />
    </div>
  );
}

