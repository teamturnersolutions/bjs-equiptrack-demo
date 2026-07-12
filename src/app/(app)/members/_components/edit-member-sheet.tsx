'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateTeamMember } from '@/app/actions';
import { type TeamMember } from '@/lib/types';

const memberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

type EditMemberSheetProps = {
    member: TeamMember;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditMemberSheet({ member, open, onOpenChange }: EditMemberSheetProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof memberSchema>>({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            name: member.name,
        },
    });

    React.useEffect(() => {
        if (open) {
            form.reset({ name: member.name });
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open, member.name, form]);

    async function onSubmit(values: z.infer<typeof memberSchema>) {
        const result = await updateTeamMember(member.id, values.name);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            onOpenChange(false);
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Team Member</SheetTitle>
                    <SheetDescription>
                        Modify the name for this team member. ID: {member.id}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Full Name"
                                            {...field}
                                            ref={(e) => {
                                                field.ref(e);
                                                (inputRef as any).current = e;
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2 pt-2">
                            <Button type="button" variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
