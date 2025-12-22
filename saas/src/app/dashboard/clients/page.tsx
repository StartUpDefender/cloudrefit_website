"use client";

import { useState, useEffect, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import Topbar from "@/components/layout/Topbar";
import AddClientModal from "@/components/clients/AddClientModal";
import ViewClientModal from "@/components/clients/ViewClientModal";
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
import { getClients, deleteClient, type Client } from "@/lib/services/clients";

export default function ClientsPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Base column definitions with default widths
  const baseColumns = useMemo(() => [
    { id: "companyName", accessor: "companyName", width: 200, minWidth: 150 },
    { id: "shortName", accessor: "shortName", width: 150, minWidth: 100 },
    { id: "clientType", accessor: "clientType", width: 120, minWidth: 100 },
    { id: "city", accessor: "city", width: 150, minWidth: 100 },
    { id: "country", accessor: "country", width: 150, minWidth: 100 },
    { id: "email", accessor: "email", width: 200, minWidth: 150 },
    { id: "mobile", accessor: "mobile", width: 150, minWidth: 100 },
    { id: "phone", accessor: "phone", width: 150, minWidth: 100 },
  ], []);

  // Columns with localized labels - updates when language changes
  const columnsWithLabels = useMemo(() => {
    const labelMap: Record<string, string> = {
      companyName: t.clients.companyName,
      shortName: t.clients.shortName,
      clientType: t.clients.clientType,
      city: t.clients.city,
      country: t.clients.country,
      email: t.clients.email,
      mobile: t.clients.mobile,
      phone: t.clients.phone,
    };
    return baseColumns.map((col) => ({
      ...col,
      label: labelMap[col.id] || col.id,
    }));
  }, [baseColumns, language, t.clients.companyName, t.clients.shortName, t.clients.clientType, t.clients.city, t.clients.country, t.clients.email, t.clients.mobile, t.clients.phone]);

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

  // Format data for display
  const formattedData = clients.map((client) => ({
    ...client,
    clientType: client.clientType === "company" ? t.clients.company : t.clients.person,
  }));

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients();
      setClients(data);
    } catch (err: any) {
      setError(err.message || t.clients.error);
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
    fetchClients();
  };

  // Calculate pagination
  const totalItems = clients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = formattedData.slice(startIndex, endIndex);

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
              {t.clients.title}
            </h1>
            <p className="mt-1 max-w-xl text-[13px] text-slate-600">
              {t.clients.title}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <FiPlus className="h-4 w-4" />
            <span>{t.clients.addClient}</span>
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
            onEdit={(client) => {
              // Find original client from clients array
              const originalClient = clients.find((c) => c.id === client.id);
              setSelectedClient(originalClient || null);
              setIsModalOpen(true);
            }}
            onDelete={(client) => {
              // Find original client from clients array
              const originalClient = clients.find((c) => c.id === client.id);
              setSelectedClient(originalClient || null);
              setIsDeleteModalOpen(true);
            }}
            onView={(client) => {
              // Find original client from clients array
              const originalClient = clients.find((c) => c.id === client.id);
              setSelectedClient(originalClient || null);
              setIsViewModalOpen(true);
            }}
          />
        </div>
      </main>

      {/* Add/Edit Client Modal */}
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        onSuccess={handleAddSuccess}
        client={selectedClient}
        mode={selectedClient ? "edit" : "add"}
      />

      {/* View Client Modal */}
      <ViewClientModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={async () => {
          if (selectedClient?.id) {
            setDeleteLoading(true);
            try {
              await deleteClient(selectedClient.id);
              setIsDeleteModalOpen(false);
              setSelectedClient(null);
              fetchClients();
            } catch (err: any) {
              setError(err.message || t.clients.deleteError);
            } finally {
              setDeleteLoading(false);
            }
          }
        }}
        itemName={selectedClient?.companyName || selectedClient?.shortName}
        loading={deleteLoading}
      />
    </div>
  );
}

