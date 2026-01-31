export enum EmployeeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED'
}

export interface Department {
    id: string;
    name: string;
    description?: string;
    managerId?: string;
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Attendance {
    id: string;
    employeeId: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
    notes?: string;
    companyId: number;
    employee?: Employee;
}

export interface Leave {
    id: string;
    employeeId: string;
    type: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'OTHER';
    startDate: string;
    endDate: string;
    reason?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    daysRequested: number;
    companyId: number;
    employee?: Employee;
}

export interface TrainingDomain {
    id: string;
    name: string;
    description?: string;
    companyId: number;
}

export interface Training {
    id: string;
    title: string;
    description?: string;
    domainId: string;
    startDate: string;
    endDate: string;
    trainer?: string;
    location?: string;
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    companyId: number;
    domain?: TrainingDomain;
}

export interface TrainingParticipation {
    id: string;
    trainingId: string;
    employeeId: string;
    status: 'ENROLLED' | 'COMPLETED' | 'FAILED';
    grade?: string;
    feedback?: string;
    employee?: Employee;
    training?: Training;
}

export interface PayslipLine {
    id: string;
    payslipId: string;
    code: string;
    label: string;
    baseAmount: number;
    rate: number;
    gainAmount: number;
    deductionAmount: number;
    type: 'GAIN' | 'DEDUCTION' | 'EMPLOYER_CHARGE';
}

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    registrationNumber: string;
    position?: string;
    baseSalary: number;
    hireDate: string;
    status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
    departmentId?: string;
    department?: Department;
    companyId: number;
}

export interface PayrollPeriod {
    id: string;
    code: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'OPEN' | 'CLOSED';
    companyId: number;
    payslips?: Payslip[];
}

export interface Payslip {
    id: string;
    periodId: string;
    employeeId: string;
    grossSalary: number;
    totalGains: number;
    totalDeductions: number;
    netSalary: number;
    status: 'DRAFT' | 'VALIDATED' | 'PAID';
    employee?: Employee;
    lines?: PayslipLine[];
}
