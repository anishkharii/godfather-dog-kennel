import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera, Image, AlertCircle, LoaderCircle, Copy } from "lucide-react";
import { uploadImage } from "./services/uploadImage";
import supabase from "./services/supabase";
import { toast } from "sonner";

export default function AddDogPage() {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    breed: "",
    owner: "",
    dob: "",
    notes: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const generateRandomId = () => {
    return Math.floor(Math.random() * 90000000) + 10000000;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.breed.trim()) newErrors.breed = "Breed is required";
    if (!formData.owner.trim()) newErrors.owner = "Owner is required";
    if (!formData.dob.trim()) newErrors.dob = "Date of birth is required";
    if (!formData.photo) newErrors.photo = "Photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      setLoading(true);
      // const imageUrl = await uploadImage(formData.photo);
      const imageUrl = 'some url of image'
      const randomId = generateRandomId();
      const sendingData = {
        breed: formData.breed,
        owner: formData.owner,
        date_of_birth: formData.dob,
        notes: formData.notes,
        image_url: imageUrl,
        unique_id: randomId,
      };
      const { data, error } = await supabase
        .from("Godfather Kennel")
        .insert([sendingData])
        .select();

      if (error) {
        console.error("Error adding dog:", error);
        return;
      }

      console.log(data);
      setUniqueId(randomId);
      setShowDialog(true);
      setFormData({
        breed: "",
        owner: "",
        dob: "",
        notes: "",
        photo: null,
      });
      setPreview(null);
    } catch (error) {
      console.error("Error adding dog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dog Added Successfully!</DialogTitle>
            <DialogDescription>
              Unique Dog ID has been generated. You can copy and share this ID.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted px-4 py-2 rounded flex items-center justify-between mt-4">
            <code className="font-mono text-xl tracking-widest bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded">
  {uniqueId
    ?.toString()
    .match(/.{1,2}/g)
    .join(" ")}
</code>

            <button
              onClick={() => {
                navigator.clipboard.writeText(uniqueId.toString());
                toast("Copied to clipboard!");
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-xl mx-auto p-6">
        <Card className="shadow-xl border border-muted bg-white dark:bg-gray-900">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center mb-4">
              Add Dog Details
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="breed" className="mb-2">
                  Breed Name *
                </Label>
                <Input
                  name="breed"
                  placeholder="Labrador, Husky..."
                  value={formData.breed}
                  onChange={handleChange}
                />
                {errors.breed && (
                  <Label className="mt-2 font-light text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.breed}
                  </Label>
                )}
              </div>

              <div>
                <Label htmlFor="owner">Owner Name *</Label>
                <Input
                  name="owner"
                  placeholder="Vishal Khari, ..."
                  value={formData.owner}
                  onChange={handleChange}
                />
                {errors.owner && (
                  <Label className="mt-2 font-light text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.owner}
                  </Label>
                )}
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                />
                {errors.dob && (
                  <Label className="mt-2 font-light text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.dob}
                  </Label>
                )}
              </div>

              <div>
                <Label>Upload Photo *</Label>
                <div className="flex gap-4 mt-2 items-center">
                  <div>
                    <div className="relative border border-primary rounded-xl p-4 bg-muted/50 hover:shadow-md transition duration-300 group cursor-pointer">
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        capture="environment"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                        <Camera className="w-8 h-8 mb-2" />
                        <p className="text-sm">Capture Live Photo</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="relative border border-dashed rounded-xl p-4 group hover:border-primary transition duration-200 cursor-pointer">
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                        <Image className="w-8 h-8 mb-2" />
                        <p className="text-sm">Choose from Gallery</p>
                      </div>
                    </div>
                  </div>
                </div>

                {errors.photo && (
                  <Label className="mt-2 font-light text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.photo}
                  </Label>
                )}

                {preview && (
                  <div className="mt-2">
                    <p className="text-sm text-green-500">
                      {formData.photo?.name}
                    </p>
                    <img
                      src={preview}
                      alt="Dog Preview"
                      className="rounded-xl max-h-28 w-1/2 object-cover border mt-2"
                    />
                  </div>
                )}
              </div>

              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="additional-notes">
                  <AccordionTrigger className="text-sm text-gray-500 shadow-xs">
                    Additional Details (Optional)
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-4">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        name="notes"
                        placeholder="Temperament, food allergies, etc."
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  "Add Dog"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
