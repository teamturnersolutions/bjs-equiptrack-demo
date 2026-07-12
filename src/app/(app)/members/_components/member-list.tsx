'use client';

import { useState } from 'react';
import { type TeamMember } from '@/lib/types';
import { EditMemberSheet } from './edit-member-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Search, User } from 'lucide-react';
import { AppHeader } from '@/components/app-header';

type MemberWithCount = TeamMember & {
    activeItemsCount: number;
};

type MemberListProps = {
    members: MemberWithCount[];
};

export function MemberList({ members }: MemberListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.id.toString() === searchQuery.trim()
    );

    const handleEditClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-6">
            <AppHeader title="Team Members" />

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Roster</CardTitle>
                    <CardDescription>
                        List of authorized team members and their active equipment count.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase border-b bg-muted/30">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3 text-center">Active Checkouts</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{member.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-primary/10 rounded-full">
                                                        <User className="size-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium text-foreground">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    member.activeItemsCount > 0 
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                    {member.activeItemsCount} {member.activeItemsCount === 1 ? 'item' : 'items'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditClick(member)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    title="Edit Member"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                            No team members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {selectedMember && (
                <EditMemberSheet
                    member={selectedMember}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                />
            )}
        </div>
    );
}
