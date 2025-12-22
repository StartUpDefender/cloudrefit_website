"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLanguage, useTranslation } from "@/context/LanguageContext";
import Pagination from "@/components/ui/Pagination";
import { FiEdit, FiTrash2, FiEye, FiChevronUp, FiChevronDown, FiChevronsDown, FiSearch, FiDownload, FiColumns, FiX } from "react-icons/fi";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SearchSidebar from "./SearchSidebar";

interface Column {
  id: string;
  label: string;
  accessor: string;
  width?: number;
  minWidth?: number;
  sortable?: boolean;
  visible?: boolean;
}

type SortDirection = "asc" | "desc" | null;

interface DataTableProps<T> {
  readonly columns: Column[];
  readonly data: T[];
  readonly loading?: boolean;
  readonly onColumnReorder?: (columns: Column[]) => void;
  readonly onColumnResize?: (columnId: string, width: number) => void;
  readonly pagination?: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly totalItems: number;
    readonly itemsPerPage: number;
    readonly onPageChange: (page: number) => void;
    readonly onItemsPerPageChange?: (itemsPerPage: number) => void;
  };
  readonly onEdit?: (row: T) => void;
  readonly onDelete?: (row: T) => void;
  readonly onView?: (row: T) => void;
  readonly actionsColumn?: boolean;
  readonly selectable?: boolean;
  readonly onSelectionChange?: (selectedRows: T[]) => void;
  readonly onSort?: (columnId: string, direction: SortDirection) => void;
  readonly searchable?: boolean;
  readonly onSearch?: (searchTerm: string) => void;
  readonly exportable?: boolean;
  readonly onExport?: (data: T[]) => void;
  readonly bulkActions?: Array<{
    label: string;
    action: (selectedRows: T[]) => void;
    icon?: React.ReactNode;
  }>;
  readonly getRowId?: (row: T) => string | number;
  readonly advancedSearch?: {
    fields: Array<{
      id: string;
      label: string;
      accessor: string;
      type?: "text" | "select";
      options?: Array<{ value: string; label: string }>;
    }>;
    onSearch: (filters: Record<string, { enabled: boolean; value: string; operator?: string }>) => void;
  };
}

export default function DataTable<T extends Record<string, any>>({
  columns: initialColumns,
  data,
  loading = false,
  onColumnReorder,
  onColumnResize,
  pagination,
  onEdit,
  onDelete,
  onView,
  actionsColumn = true,
  selectable = false,
  onSelectionChange,
  onSort,
  searchable = false,
  onSearch,
  exportable = false,
  onExport,
  bulkActions,
  getRowId,
}: DataTableProps<T>) {
  const { language } = useLanguage();
  const t = useTranslation();
  const isRTL = language === "ar";
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const pendingReorderRef = useRef<Column[] | null>(null);
  const pendingResizeRef = useRef<{ columnId: string; width: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Add select column if selectable - always first (right in RTL, left in LTR)
    let columnsWithSelect = selectable 
      ? [{ id: "select", label: "", accessor: "select", width: 50, minWidth: 50, sortable: false }]
      : [];
    
    // Add actions column if actions are provided - always last
    const actionsCol = actionsColumn && (onEdit || onDelete || onView)
      ? [{ id: "actions", label: t.table.actions, accessor: "actions", width: 120, minWidth: 100, sortable: false }]
      : [];
    
    // Order: select column first, then data columns, then actions column last
    const orderedColumns = [...columnsWithSelect, ...initialColumns, ...actionsCol];
    
    setColumns(orderedColumns);
  }, [initialColumns, actionsColumn, selectable, onEdit, onDelete, onView, t.table.actions]);

  // Handle column reorder callback after state update
  useEffect(() => {
    if (pendingReorderRef.current && onColumnReorder) {
      const columnsToNotify = pendingReorderRef.current;
      pendingReorderRef.current = null;
      // Use setTimeout to defer the callback to next tick
      setTimeout(() => {
        onColumnReorder(columnsToNotify);
      }, 0);
    }
  }, [columns, onColumnReorder]);

  // Handle column resize callback after state update
  useEffect(() => {
    if (pendingResizeRef.current && onColumnResize) {
      const resizeData = pendingResizeRef.current;
      pendingResizeRef.current = null;
      // Use setTimeout to defer the callback to next tick
      setTimeout(() => {
        onColumnResize(resizeData.columnId, resizeData.width);
      }, 0);
    }
  }, [columns, onColumnResize]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newColumns = arrayMove(items, oldIndex, newIndex);
        // Store for later callback
        pendingReorderRef.current = newColumns;
        return newColumns;
      });
    }
  }, []);

  const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      setResizingColumn(columnId);
      setResizeStartX(e.clientX);
      setResizeStartWidth(column.width || 150);
    }
  };

  const handleResize = useCallback((e: MouseEvent) => {
    if (!resizingColumn) return;

    const diff = e.clientX - resizeStartX;
    const newWidth = Math.max(
      columns.find((col) => col.id === resizingColumn)?.minWidth || 100,
      resizeStartWidth + diff
    );

    setColumns((prev) => {
      const updated = prev.map((col) =>
        col.id === resizingColumn ? { ...col, width: newWidth } : col
      );
      // Store for later callback
      pendingResizeRef.current = { columnId: resizingColumn, width: newWidth };
      return updated;
    });
  }, [resizingColumn, resizeStartX, resizeStartWidth, columns]);

  const handleResizeEnd = () => {
    setResizingColumn(null);
  };

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
      return () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [resizingColumn, handleResize]);

  // Handle sorting
  const handleSort = useCallback((columnId: string) => {
    if (columnId === "actions" || columnId === "select") return;
    
    const column = columns.find((col) => col.id === columnId);
    if (column && column.sortable === false) return;

    let newDirection: SortDirection = "asc";
    if (sortColumn === columnId) {
      if (sortDirection === "asc") {
        newDirection = "desc";
      } else if (sortDirection === "desc") {
        newDirection = null;
      }
    }

    setSortColumn(newDirection ? columnId : null);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(columnId, newDirection);
    }
  }, [sortColumn, sortDirection, columns, onSort]);

  // Handle row selection
  const getRowIdentifier = useCallback((row: T, index: number): string | number => {
    if (getRowId) {
      return getRowId(row);
    }
    return (row as any).id || index;
  }, [getRowId]);

  const handleSelectRow = useCallback((row: T, index: number) => {
    if (!selectable) return;
    const rowId = getRowIdentifier(row, index);
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, [selectable, getRowIdentifier]);

  const handleSelectAll = useCallback(() => {
    if (!selectable) return;
    const allSelected = data.length > 0 && selectedRows.size === data.length;
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      const allIds = data.map((row, index) => getRowIdentifier(row, index));
      setSelectedRows(new Set(allIds));
    }
  }, [selectable, data, selectedRows, getRowIdentifier]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange && selectable) {
      const selectedData = data.filter((row, index) => 
        selectedRows.has(getRowIdentifier(row, index))
      );
      onSelectionChange(selectedData);
    }
  }, [selectedRows, data, onSelectionChange, selectable, getRowIdentifier]);

  // Handle search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  }, [onSearch]);

  // Handle export
  const handleExport = useCallback(() => {
    if (onExport) {
      const dataToExport = selectedRows.size > 0 
        ? data.filter((row, index) => selectedRows.has(getRowIdentifier(row, index)))
        : data;
      onExport(dataToExport);
    }
  }, [onExport, data, selectedRows, getRowIdentifier]);

  // Filter visible columns
  const visibleColumns = columns.filter((col) => col.visible !== false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-slate-500 animate-pulse-slow">{t.table.loading}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-slate-500">{t.table.noData}</div>
      </div>
    );
  }

  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      {/* Toolbar: Search, Column Visibility, Export */}
      {(searchable || exportable || columns.length > 0) && (
        <div className={`flex flex-wrap items-center gap-3 p-4 bg-white  ${isRTL ? "flex-row-reverse" : ""}`}>
          {/* Search */}
          {searchable && (
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 ${isRTL ? "right-3" : "left-3"}`} />
                <Input
                  type="text"
                  placeholder={t.table.search}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`${isRTL ? "pr-10" : "pl-10"}`}
                />
              </div>
            </div>
          )}

          {/* Column Visibility Toggle */}
          {columns.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowColumnVisibility(!showColumnVisibility)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label={t.table.toggleColumns}
              >
                <FiColumns className="h-4 w-4" />
                <span className="text-sm">{t.table.columns}</span>
              </button>

              {showColumnVisibility && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowColumnVisibility(false)}
                  />
                  <div className={`absolute ${isRTL ? "left-0" : ""} top-full mt-2 z-50 w-64 bg-white 
                  border border-slate-200 rounded-lg shadow-lg p-4 animate-slide-in-down`}>
                    <div className={`flex items-center justify-between mb-3`}>
                      <h3 className="text-sm font-semibold text-slate-800">{t.table.columns}</h3>
                      <button
                        onClick={() => setShowColumnVisibility(false)}
                        className="text-slate-400 hover:text-slate-600"
                        aria-label={t.modals.close}
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {columns.filter((col) => col.id !== "actions" && col.id !== "select").map((col) => (
                          <label
                            key={col.id}
                            className={`flex items-center gap-0 p-2 rounded hover:bg-slate-50 cursor-pointer w-full ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Checkbox
                              checked={col.visible !== false}
                              onChange={(e) => {
                                setColumns((prev) =>
                                  prev.map((c) =>
                                    c.id === col.id ? { ...c, visible: e.target.checked } : c
                                  )
                                );
                              }}
                              className="shrink-0"
                            />
                            <span className={`text-sm text-slate-700 whitespace-nowrap ${isRTL ? "mr-0" : "ml-0"}`}>{col.label}</span>
                          </label>
                      ))}
                    </div>
                    <div className={`flex gap-2 mt-4 pt-4 border-t border-slate-200 `}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setColumns((prev) =>
                            prev.map((col) =>
                              col.id === "actions" || col.id === "select"
                                ? col
                                : { ...col, visible: true }
                            )
                          );
                        }}
                      >
                        {t.table.showAll}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setColumns((prev) =>
                            prev.map((col) =>
                              col.id === "actions" || col.id === "select"
                                ? col
                                : { ...col, visible: false }
                            )
                          );
                        }}
                      >
                        {t.table.hideAll}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Export */}
          {exportable && onExport && (
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <FiDownload className="h-4 w-4" />
              <span>{t.table.export}</span>
            </Button>
          )}
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectable && selectedRows.size > 0 && bulkActions && bulkActions.length > 0 && (
        <div className={`flex items-center gap-3 p-4 bg-[var(--brand-soft)]/30 border border-[var(--brand)]/20 rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className="text-sm font-medium text-slate-700">
            {selectedRows.size} {t.table.selected}
          </span>
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  const selectedData = data.filter((row, idx) =>
                    selectedRows.has(getRowIdentifier(row, idx))
                  );
                  action.action(selectedData);
                }}
                className="flex items-center gap-2"
              >
                {action.icon}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div
          ref={tableRef}
          className="overflow-x-auto border border-[var(--brand-soft)] rounded-lg bg-white shadow-sm animate-fade-in"
          dir={isRTL ? "rtl" : "ltr"}
        >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[var(--brand-soft)]/40 via-[var(--brand-soft)]/60 to-[var(--brand-soft)]/40 border-b-2 border-[var(--brand)]/30">
              <SortableContext
                items={columns.filter((col) => col.id !== "actions" && col.id !== "select").map((col) => col.id)}
                strategy={horizontalListSortingStrategy}
              >
                {visibleColumns.map((column, colIndex) => {
                  const isLastCol = colIndex === visibleColumns.length - 1;
                  let borderClass = "";
                  if (!isLastCol) {
                    borderClass = isRTL ? "border-l border-[var(--brand)]/20" : "border-r border-[var(--brand)]/20";
                  }
                  
                  // Select column
                  if (column.id === "select") {
                    return (
                      <th
                        key={column.id}
                        className={`px-4 py-3.5 text-xs font-bold text-slate-800 uppercase tracking-wider select-none relative ${borderClass}`}
                        style={{
                          width: column.width ? `${column.width}px` : undefined,
                          minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                        }}
                      >
                        <div className={`flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Checkbox
                            checked={allSelected}
                            indeterminate={someSelected}
                            onChange={handleSelectAll}
                            aria-label={t.table.selectAll}
                          />
                        </div>
                      </th>
                    );
                  }
                  
                  // Actions column is not sortable
                  if (column.id === "actions") {
                    return (
                      <th
                        key={column.id}
                        className={`px-4 py-3.5 text-xs font-bold text-slate-800 uppercase tracking-wider select-none relative ${isRTL ? "text-right" : "text-left"} ${borderClass}`}
                        style={{
                          width: column.width ? `${column.width}px` : undefined,
                          minWidth: column.minWidth
                            ? `${column.minWidth}px`
                            : undefined,
                        }}
                      >
                        {column.label}
                      </th>
                    );
                  }
                  return (
                    <SortableTableHeader
                      key={column.id}
                      column={column}
                      onResizeStart={handleResizeStart}
                      onSort={handleSort}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      isRTL={isRTL}
                      isLastColumn={isLastCol}
                    />
                  );
                })}
              </SortableContext>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`transition-all duration-200 animate-fade-in-row ${
                  rowIndex % 2 === 0
                    ? "bg-white hover:bg-[var(--brand-soft)]/30"
                    : "bg-[var(--brand-soft)]/15 hover:bg-[var(--brand-soft)]/40"
                }`}
                style={{
                  animationDelay: `${rowIndex * 0.03}s`,
                }}
              >
                {visibleColumns.map((column, colIndex) => {
                  const isLastCol = colIndex === visibleColumns.length - 1;
                  let borderClass = "";
                  if (!isLastCol) {
                    borderClass = isRTL ? "border-l border-[var(--brand)]/20" : "border-r border-[var(--brand)]/20";
                  }
                  
                  // Handle select column
                  if (column.id === "select") {
                    const rowId = getRowIdentifier(row, rowIndex);
                    const isSelected = selectedRows.has(rowId);
                    return (
                      <td
                        key={column.id}
                        className={`px-4 py-3 text-sm relative ${borderClass}`}
                        style={{
                          width: column.width ? `${column.width}px` : undefined,
                          minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                        }}
                      >
                        <div className={`flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectRow(row, rowIndex)}
                            aria-label={t.table.selectAll}
                          />
                        </div>
                      </td>
                    );
                  }
                  
                  // Handle actions column
                  if (column.id === "actions") {
                    return (
                      <td
                        key={column.id}
                        className={`px-4 py-3 text-sm relative ${isRTL ? "text-right" : "text-left"} ${borderClass}`}
                        style={{
                          width: column.width ? `${column.width}px` : undefined,
                          minWidth: column.minWidth
                            ? `${column.minWidth}px`
                            : undefined,
                        }}
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
                              aria-label={t.table.view}
                              title={t.table.view}
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-[var(--brand-soft)] hover:border-[var(--brand)] hover:text-[var(--brand-strong)] transition-all duration-200"
                              aria-label={t.table.edit}
                              title={t.table.edit}
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-600 transition-all duration-200"
                              aria-label={t.table.delete}
                              title={t.table.delete}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  }

                  // Regular column - with vertical borders
                  const isLastDataCol = colIndex === columns.length - 1;
                  let cellBorderClass = "";
                  if (!isLastDataCol) {
                    cellBorderClass = isRTL ? "border-l border-[var(--brand)]/20" : "border-r border-[var(--brand)]/20";
                  }
                  const textColor = rowIndex % 2 === 0 ? "text-slate-700" : "text-slate-800";
                  
                  return (
                    <td
                      key={column.id}
                      className={`px-4 py-3 text-sm transition-colors duration-200 relative
                         ${textColor} ${isRTL ? "text-right" : "text-left"} ${cellBorderClass}`}
                      style={{
                        width: column.width ? `${column.width}px` : undefined,
                        minWidth: column.minWidth
                          ? `${column.minWidth}px`
                          : undefined,
                      }}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {row[column.accessor] || (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
          onItemsPerPageChange={pagination.onItemsPerPageChange}
        />
      )}
      </DndContext>
    </div>
  );
}

interface SortableTableHeaderProps {
  readonly column: Column;
  readonly onResizeStart: (columnId: string, e: React.MouseEvent) => void;
  readonly onSort?: (columnId: string) => void;
  readonly sortColumn?: string | null;
  readonly sortDirection?: SortDirection;
  readonly isRTL: boolean;
  readonly isLastColumn?: boolean;
}

function SortableTableHeader({
  column,
  onResizeStart,
  onSort,
  sortColumn,
  sortDirection,
  isRTL,
  isLastColumn = false,
}: SortableTableHeaderProps) {
  const t = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  let headerBorderClass = "";
  if (!isLastColumn) {
    headerBorderClass = isRTL ? "border-l border-[var(--brand)]/20" : "border-r border-[var(--brand)]/20";
  }

  return (
    <th
      ref={setNodeRef}
      style={{
        ...style,
        width: column.width ? `${column.width}px` : undefined,
        minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
        position: "relative",
      }}
      className={`px-4 py-3.5 text-xs font-bold text-slate-800 uppercase tracking-wider select-none relative group ${isRTL ? "text-right" : "text-left"} ${headerBorderClass}`}
    >
      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div
          className={`flex items-center gap-2 flex-1 ${isRTL ? "flex-row-reverse justify-end" : "justify-start"}`}
        >
          <span
            {...attributes}
            {...listeners}
            className={`cursor-move hover:text-[var(--brand-strong)] transition-colors duration-200 ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {column.label}
          </span>
              {onSort && column.sortable !== false && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSort(column.id);
                  }}
                  className="flex items-center text-slate-400 hover:text-[var(--brand-strong)] transition-colors"
                  aria-label={
                    sortColumn === column.id
                      ? sortDirection === "asc"
                        ? t.table.sortDesc
                        : sortDirection === "desc"
                        ? t.table.noSort
                        : t.table.sortAsc
                      : t.table.sortAsc
                  }
                >
                  {sortColumn === column.id ? (
                    sortDirection === "asc" ? (
                      <FiChevronUp className="h-4 w-4" />
                    ) : sortDirection === "desc" ? (
                      <FiChevronDown className="h-4 w-4" />
                    ) : (
                      <FiChevronsDown className="h-4 w-4" />
                    )
                  ) : (
                    <FiChevronsDown className="h-4 w-4 opacity-30" />
                  )}
                </button>
              )}
        </div>
        {!isLastColumn && (
          <button
            type="button"
            className={`absolute top-0 bottom-0 w-[1px] bg-[var(--brand)]/30 hover:bg-[var(--brand)] cursor-col-resize transition-colors duration-200 ${isRTL ? "left-0" : "right-0"} opacity-60 hover:opacity-100`}
            onMouseDown={(e) => onResizeStart(column.id, e)}
            aria-label={isRTL ? "تغيير حجم العمود" : "Resize column"}
            style={{
              zIndex: 10,
            }}
          />
        )}
      </div>
    </th>
  );
}

