import { useOrganizationMembers } from "@/app/[locale]/[organizationId]/members/lib/membersHooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { MemberId } from "typeid";

interface MemberDropdownProps {
  selectedMemberId: MemberId | null | undefined;
  onMemberSelect: (memberId: MemberId | null) => void;
  disabled?: boolean;
  className?: string;
}

export function MemberDropdown({
  selectedMemberId,
  onMemberSelect,
  disabled = false,
  className = "w-[140px]",
}: MemberDropdownProps) {
  const { members, isLoading } = useOrganizationMembers();

  if (isLoading) {
    return <Skeleton className={`h-[36px] ${className}`} />;
  }

  const selectedMember = members?.find((m) => m.id === selectedMemberId);

  return (
    <Select
      value={selectedMemberId ?? "unassigned"}
      onValueChange={(value) =>
        onMemberSelect(value === "unassigned" ? null : (value as MemberId))
      }
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedMember?.user.name ?? selectedMemberId ?? "Unassigned"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {members?.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.user.name ?? member.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
