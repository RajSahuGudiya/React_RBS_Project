import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import DataTable from '../../components/common/DataTable';
import Pagination from '../../components/common/Pagination';
import FilterPanel from '../../components/common/FilterPanel';
import ToastMessage from '../../components/common/ToastMessage';
import FormInput from '../../components/forms/FormInput';
import SelectInput from '../../components/forms/SelectInput';
import auditLogApi from '../../api/auditLogApi';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { getErrorMessage } from '../../api/axiosConfig';

const ACTION_OPTIONS = [
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'VIEW', label: 'View' },
];

/**
 * Audit Logs page
 */
const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    username: '',
    action: '',
    moduleName: '',
    startDate: '',
    endDate: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        username: appliedFilters.username,
        action: appliedFilters.action,
        moduleName: appliedFilters.moduleName,
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
      };
      const response = await auditLogApi.getAll(params);
      const data = response.data;
      setLogs(data.content || data || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || (data.content || data || []).length);
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, 'Failed to load audit logs'), type: 'error' });
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const columns = [
    { key: 'id', label: 'Log ID', width: '80px' },
    { key: 'username', label: 'Username' },
    { key: 'action', label: 'Action' },
    { key: 'moduleName', label: 'Module Name' },
    { key: 'description', label: 'Description' },
    { key: 'ipAddress', label: 'IP Address' },
    {
      key: 'createdDate',
      label: 'Created Date',
      render: (row) => row.createdDate || row.createdAt || '-',
    },
  ];

  return (
    <AppLayout
      pageTitle="Audit Logs"
      breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Audit Logs' }]}
    >
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <FilterPanel
        onApply={() => {
          setAppliedFilters({ ...filters });
          setCurrentPage(0);
        }}
        onClear={() => {
          const empty = { username: '', action: '', moduleName: '', startDate: '', endDate: '' };
          setFilters(empty);
          setAppliedFilters(empty);
          setCurrentPage(0);
        }}
      >
        <div className="col-md-2">
          <FormInput
            label="Username"
            name="username"
            value={filters.username}
            onChange={(e) => setFilters((prev) => ({ ...prev, username: e.target.value }))}
          />
        </div>
        <div className="col-md-2">
          <SelectInput
            label="Action"
            name="action"
            value={filters.action}
            onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
            options={ACTION_OPTIONS}
            placeholder="All Actions"
          />
        </div>
        <div className="col-md-2">
          <FormInput
            label="Module Name"
            name="moduleName"
            value={filters.moduleName}
            onChange={(e) => setFilters((prev) => ({ ...prev, moduleName: e.target.value }))}
          />
        </div>
        <div className="col-md-2">
          <FormInput
            label="Start Date"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div className="col-md-2">
          <FormInput
            label="End Date"
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </FilterPanel>

      <div className="card">
        <div className="card-body">
          <div className="table-toolbar">
            <div className="table-toolbar-right ms-auto">
              <button className="btn btn-outline-secondary btn-sm" onClick={loadLogs}>
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            emptyMessage="No audit logs found."
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default AuditLogsPage;
