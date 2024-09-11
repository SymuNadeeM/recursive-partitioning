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
      let partitionFound = false;

      prevPartitions.forEach((partition) => {
        if (partition.id === id) {
          partitionFound = true;

          // Calculate new partition sizes
          const newSize = partition.size / 2;

          if (splitDirection === "H") {
            // Horizontal split, keep direction same as original
            newPartitions.push({
              ...partition,
              size: newSize,
              direction: "row", // Keep the partition in row direction
            });

            newPartitions.push({
              id: Date.now() + 1,
              color: getRandomColor(),
              size: newSize,
              direction: "row", // Keep the partition in row direction for horizontal
            });
          } else if (splitDirection === "V") {
            // Vertical split: stack partitions inside the original partition using flex-col (Y-axis)
            newPartitions.push({
              ...partition,
              size: newSize,
              direction: "column", // Change direction to column for vertical split
            });

            newPartitions.push({
              id: Date.now() + 1,
              color: getRandomColor(),
              size: newSize,
              direction: "column", // Ensure vertical stacking for both
            });
          }
        } else {
          newPartitions.push(partition);
        }
      });

      // If the partition was not found, return the original list
      if (!partitionFound) return prevPartitions;

      return newPartitions;
    });
  };

  const removePartition = (id) => {
    setPartitions((prevPartitions) =>
      prevPartitions.filter((partition) => partition.id !== id)
    );
  };

  // Helper function to determine the flex direction
  const getFlexDirection = (direction) => {
    return direction === "row" ? "flex-row" : "flex-col";
  };

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center">
      <div className="w-full h-[600px] border border-gray-400 overflow-auto">
        {/* Main flex container */}
        <div className="w-full h-full flex overflow-auto">
          {partitions.map((partition) => (
            <div
              key={partition.id}
              className={`relative border flex ${getFlexDirection(partition.direction)} transition-all duration-300`}
              style={{
                flex: partition.size,
                backgroundColor: partition.color,
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
                  onClick={() => splitPartition(partition.id, "V")} // Vertical split (Y-axis)
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
