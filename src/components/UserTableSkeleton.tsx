import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface UserTableSkeletonProps {
  rowCount?: number
}

export function UserTableSkeleton({ rowCount = 5 }: UserTableSkeletonProps) {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Skeleton className="h-5 w-[100px]" /></TableHead>
            <TableHead><Skeleton className="h-5 w-[150px]" /></TableHead>
            <TableHead><Skeleton className="h-5 w-[120px]" /></TableHead>
            <TableHead><Skeleton className="h-5 w-[100px]" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}