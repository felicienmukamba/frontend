import { api } from '@/services/api';
import { Employee, PayrollPeriod, Payslip, Department, Attendance, Leave, Training, TrainingDomain } from '../types';

export const hrApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Employees
        getEmployees: builder.query<Employee[], any | void>({
            query: (params) => ({ url: '/hr/employees', params: params || {} }),
            providesTags: ['Employee'],
        }),
        getEmployee: builder.query<Employee, string>({
            query: (id) => `/hr/employees/${id}`,
            providesTags: (result, error, id) => [{ type: 'Employee', id }],
        }),
        createEmployee: builder.mutation<Employee, Partial<Employee>>({
            query: (data) => ({
                url: '/hr/employees',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),
        updateEmployee: builder.mutation<Employee, { id: string; data: Partial<Employee> }>({
            query: ({ id, data }) => ({
                url: `/hr/employees/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Employee', { type: 'Employee', id }],
        }),
        deleteEmployee: builder.mutation<void, string>({
            query: (id) => ({
                url: `/hr/employees/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Employee'],
        }),

        // Departments
        getDepartments: builder.query<Department[], { companyId: number }>({
            query: (params) => ({ url: '/departments', params }),
            providesTags: ['Employee'], // Reusing or adding Tag? Let's assume Employee for now to simplify or add tags
        }),
        createDepartment: builder.mutation<Department, Partial<Department>>({
            query: (data) => ({
                url: '/departments',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),
        updateDepartment: builder.mutation<Department, { id: string; data: Partial<Department> }>({
            query: ({ id, data }) => ({
                url: `/departments/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),
        deleteDepartment: builder.mutation<void, string>({
            query: (id) => ({
                url: `/departments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Employee'],
        }),

        // Payroll
        getPayrollPeriods: builder.query<PayrollPeriod[], void>({
            query: () => '/hr/payroll/periods',
            providesTags: ['PayrollPeriod'],
        }),
        createPayrollPeriod: builder.mutation<PayrollPeriod, any>({
            query: (data) => ({
                url: '/hr/payroll/periods',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['PayrollPeriod'],
        }),
        closePayrollPeriod: builder.mutation<PayrollPeriod, string>({
            query: (id) => ({
                url: `/hr/payroll/periods/${id}/close`,
                method: 'PATCH',
            }),
            invalidatesTags: ['PayrollPeriod'],
        }),
        getPayslips: builder.query<Payslip[], { periodId?: string }>({
            query: (params) => ({ url: '/hr/payroll/payslips', params }),
            providesTags: ['Payslip'],
        }),
        createPayslip: builder.mutation<Payslip, any>({
            query: (data) => ({
                url: '/hr/payroll/payslips',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Payslip'],
        }),
        processPayslip: builder.mutation<Payslip, string>({
            query: (id) => ({
                url: `/hr/payslip/${id}/process`,
                method: 'POST',
            }),
            invalidatesTags: ['Payslip', 'AccountingEntry'],
        }),
        generatePayrollAccounting: builder.mutation<void, { id: string; userId?: number }>({
            query: ({ id, userId }) => ({
                url: `/hr/payslip/${id}/accounting`,
                method: 'POST',
                body: { userId },
            }),
            invalidatesTags: ['AccountingEntry'],
        }),

        // Attendance
        getAttendances: builder.query<Attendance[], any | void>({
            query: (params) => ({ url: '/attendances', params: params || {} }),
            providesTags: ['Employee'],
        }),
        createAttendance: builder.mutation<Attendance, any>({
            query: (data) => ({
                url: '/attendances',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),

        // Leaves
        getLeaves: builder.query<Leave[], any | void>({
            query: (params) => ({ url: '/leaves', params: params || {} }),
            providesTags: ['Employee'],
        }),
        createLeave: builder.mutation<Leave, any>({
            query: (data) => ({
                url: '/leaves',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),
        updateLeaveStatus: builder.mutation<Leave, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/leaves/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Employee'],
        }),

        // Trainings
        getTrainings: builder.query<Training[], void>({
            query: () => '/trainings',
            providesTags: ['Employee'],
        }),
        getTrainingDomains: builder.query<TrainingDomain[], void>({
            query: () => '/trainings/domains',
            providesTags: ['Employee'],
        }),
        createTraining: builder.mutation<Training, any>({
            query: (data) => ({
                url: '/trainings',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useGetEmployeeQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,

    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,

    useGetPayrollPeriodsQuery,
    useCreatePayrollPeriodMutation,
    useGetPayslipsQuery,
    useCreatePayslipMutation,
    useProcessPayslipMutation,
    useGetAttendancesQuery,
    useCreateAttendanceMutation,
    useGetLeavesQuery,
    useCreateLeaveMutation,
    useUpdateLeaveStatusMutation,
    useGetTrainingsQuery,
    useGetTrainingDomainsQuery,
    useCreateTrainingMutation,
} = hrApi;
