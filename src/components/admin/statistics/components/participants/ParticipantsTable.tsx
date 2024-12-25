import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParticipantRow } from "./ParticipantRow";

type Participant = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
};

interface ParticipantsTableProps {
  participants: Participant[];
  loading: boolean;
  onEdit: (participant: Participant) => void;
  onDelete: (email: string) => void;
}

export const ParticipantsTable = ({
  participants,
  loading,
  onEdit,
  onDelete,
}: ParticipantsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Chargement...
              </TableCell>
            </TableRow>
          ) : participants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Aucun participant trouvé
              </TableCell>
            </TableRow>
          ) : (
            participants.map((participant) => (
              <ParticipantRow
                key={participant.email}
                participant={participant}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};