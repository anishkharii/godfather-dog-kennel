import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MoreVertical, Trash2, Pencil, Eye } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import supabase from "../services/supabase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [dateFilter, setDateFilter] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const dogsPerPage = 10;

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Godfather Kennel")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setDogs(data);
      } catch (error) {
        console.error("Error fetching dogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDogs();
  }, []);

  useEffect(() => {
    let filtered = dogs;
    if (dateFilter) {
      console.log(new Date(dateFilter).toDateString());
      const selectedDate = new Date(dateFilter).toDateString();
      filtered = filtered.filter(
        (dog) => new Date(dog.created_at).toDateString() === selectedDate
      );
    }
    if (ownerFilter) {
      filtered = filtered.filter((dog) =>
        dog.owner.toLowerCase().includes(ownerFilter.toLowerCase())
      );
    }
    setFilteredDogs(filtered);
    setCurrentPage(1);
  }, [dateFilter, ownerFilter, dogs]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("Godfather Kennel")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setDogs((prev) => prev.filter((dog) => dog.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Error deleting dog:", error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastDog = currentPage * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = filteredDogs.slice(indexOfFirstDog, indexOfLastDog);
  const totalPages = Math.ceil(filteredDogs.length / dogsPerPage);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Button className="mb-5 p-5" onClick={() => navigate("/add-dog")}>
        Add Dog
      </Button>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="w-4 h-4" />
                {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
              />
            </PopoverContent>
          </Popover>
          <Input
            placeholder="Search by owner"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>Dog List</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Breed</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Date of Selling</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: dogsPerPage }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : currentDogs.length > 0 ? (
                currentDogs.map((dog) => (
                  <TableRow key={dog.id}>
                    <TableCell>{dog.breed}</TableCell>
                    <TableCell>{dog.owner}</TableCell>
                    <TableCell>
                      {new Date(dog.created_at).toDateString()}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger>
                          <MoreVertical className="cursor-pointer w-4 h-4" />
                        </PopoverTrigger>
                        <PopoverContent className="w-32 p-2 text-sm">
                          <div
                            className="hover:bg-gray-100 p-1 rounded cursor-pointer flex gap-2 items-center"
                            onClick={() => navigate(`/dog/${dog.unique_id}`)}
                          >
                            <Eye className="w-4 h-4" /> View
                          </div>
                          <div className="hover:bg-gray-100 p-1 rounded cursor-pointer flex gap-2 items-center">
                            <Pencil className="w-4 h-4" /> Edit
                          </div>
                          <div
                            onClick={() => setConfirmDeleteId(dog.id)}
                            className="hover:bg-red-100 p-1 rounded cursor-pointer flex gap-2 items-center text-red-600"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-4"
                  >
                    No dogs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <p>Are you sure you want to delete this dog entry?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(confirmDeleteId)}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
