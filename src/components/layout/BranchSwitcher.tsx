'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectSelectedBranchId,
    setSelectedBranchId
} from '@/features/auth/slices/authSlice';
import { useGetBranchesQuery } from '@/features/admin/api/adminApi';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function BranchSwitcher() {
    const dispatch = useDispatch();
    const selectedBranchId = useSelector(selectSelectedBranchId);
    const { data: branchesData, isLoading } = useGetBranchesQuery({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const branches = (branchesData as any)?.data || branchesData || [];

    const handleBranchChange = (value: string) => {
        const id = value === 'all' ? null : Number(value);
        dispatch(setSelectedBranchId(id));

        const branchName = branches.find((b: any) => b.id === id)?.name || 'Toutes les branches';
        toast.success(`Branche active : ${branchName}`);

        // Reload page to ensure all data is refreshed with the new branch-id header
        // Alternatively, use RTK Query tags to invalidate everything, but reload is safer for a global context change
        window.location.reload();
    };

    const currentBranch = branches.find((b: any) => b.id === selectedBranchId);

    return (
        <div className="flex items-center gap-2">
            <Select
                value={selectedBranchId ? String(selectedBranchId) : 'all'}
                onValueChange={handleBranchChange}
            >
                <SelectTrigger className="w-[200px] h-9 bg-slate-50 border-slate-200 rounded-xl hover:bg-slate-100 transition-all focus:ring-purple-500/20">
                    <div className="flex items-center gap-2 truncate">
                        <Building2 className="h-4 w-4 text-purple-600 shrink-0" />
                        <span className="text-sm font-semibold text-slate-700 truncate">
                            {currentBranch ? currentBranch.name : 'Toutes les branches'}
                        </span>
                    </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
                    <SelectItem value="all" className="rounded-lg py-2 cursor-pointer focus:bg-purple-50 focus:text-purple-600">
                        <div className="flex items-center justify-between w-full">
                            <span>Toutes les branches</span>
                            {!selectedBranchId && <Check className="h-3 w-3 ml-2" />}
                        </div>
                    </SelectItem>
                    {branches.map((branch: any) => (
                        <SelectItem
                            key={branch.id}
                            value={String(branch.id)}
                            className="rounded-lg py-2 cursor-pointer focus:bg-purple-50 focus:text-purple-600"
                        >
                            <div className="flex items-center justify-between w-full">
                                <span>{branch.name}</span>
                                {branch.isMain && <span className="ml-2 px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[9px] font-bold uppercase">Main</span>}
                                {selectedBranchId === branch.id && <Check className="h-3 w-3 ml-2" />}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
