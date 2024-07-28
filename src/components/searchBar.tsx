"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export function SearchBar() {
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleButtonClick = () => {
    setIsInputVisible(!isInputVisible); // Toggle input visibility
  };
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = document.getElementById("search-input") as HTMLInputElement;
    if (!inputElement) return;
    const searchTerm = inputElement.value;
    if (!searchTerm) {
      setIsInputVisible(false); // Close input visibility
      return;
    }
    router.push(`/search?q=${searchTerm}`);
    setIsInputVisible(false); // Close input visibility
  };
  return (
    // <div className="my-2 flex w-full max-w-xs flex-col items-center space-y-2 sm:max-w-sm sm:flex-row sm:space-x-2 sm:space-y-0 md:max-w-lg lg:max-w-xl xl:max-w-2xl">
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xs flex-col items-center space-y-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end"
    >
      {!isInputVisible && (
        <button onClick={handleButtonClick} className="mt-2 md:block">
          <Search className="h-[1.2rem] w-[1.2rem]" />{" "}
          <p className="hidden md:block">Search</p>
        </button>
      )}
      {isInputVisible && (
        <>
          <Suspense fallback={<div>Loading...</div>}>
            <Input
              id="search-input"
              type="text"
              placeholder="Search.."
              className="absolute inset-0"
            />
          </Suspense>
          <button type="submit" className="ml-2 flex flex-row">
            <Search className="h-[1.2rem] w-[1.2rem]" />{" "}
            <p className="hidden md:block">Search</p>
          </button>
        </>
      )}
    </form>
  );
}
