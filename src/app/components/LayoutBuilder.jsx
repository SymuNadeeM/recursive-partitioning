"use client";

import { useState } from "react";

// Helper function to generate random colors
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const LayoutBuilder = () => {
  const [partitions, setPartitions] = useState([
    { id: Date.now(), color: getRandomColor(), size: 1, direction: "row" }, // Default to horizontal (row) direction
  ]);

  const splitPartition = (id, splitDirection) => {
    setPartitions((prevPartitions) => {
      const newPartitions = [];
      prevPartitions.forEach((partition) => {
        if (partition.id === id) {
          const newPartition = {
            id: Date.now() + 1,
            color: getRandomColor(), // New partition gets a new random color
            size: partition.size / 2, // Halve the size
            direction: splitDirection === "H" ? "row" : "col", // Horizontal -> row; Vertical -> col
          };
          // First partition keeps its old color and size
          newPartitions.push({
            ...partition,
            size: partition.size / 2, // Halve the size
            direction: splitDirection === "H" ? "row" : "col", // Change the direction accordingly
          });
          newPartitions.push(newPartition); // Push new partition with new color
        } else {
          newPartitions.push(partition);
        }
      });
      return newPartitions;
    });
  };

  const removePartition = (id) => {
    setPartitions((prevPartitions) =>
      prevPartitions.filter((partition) => partition.id !== id)
    );
  };

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center">
      <div className="w-full h-[600px] border border-gray-400">
        {/* Main flex container to handle row or column splits */}
        <div className="w-full h-full flex">
          {partitions.map((partition) => (
            <div
              key={partition.id}
              className={`relative border ${
                partition.direction === "col" ? "flex-col" : "flex-row" // Set direction based on partition type
              } flex transition-all duration-300`}
              style={{
                flex: partition.size, // Set flex size to manage space
                backgroundColor: partition.color, // Retain color for original partition
              }}
            >
              {/* Buttons for splitting and removing */}
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <button
                  className="bg-white text-black border p-1 rounded"
                  onClick={() => splitPartition(partition.id, "H")} // Horizontal split
                >
                  H
                </button>
                <button
                  className="bg-white text-black border p-1 rounded"
                  onClick={() => splitPartition(partition.id, "V")} // Vertical split
                >
                  V
                </button>
                <button
                  className="bg-white text-black border p-1 rounded"
                  onClick={() => removePartition(partition.id)}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayoutBuilder;
