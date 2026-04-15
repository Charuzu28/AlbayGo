import type { RouteOption } from "../types/chat";

interface RouteCardProps {
  route: RouteOption;
  index: number;
}

export default function RouteCard({ route, index }: RouteCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Option {index + 1}
        </h3>
        <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
          {route.vehicle}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">From:</span> {route.from}
        </p>
        <p>
          <span className="font-medium text-gray-900">To:</span> {route.to}
        </p>
        <p>
          <span className="font-medium text-gray-900">Via:</span>{" "}
          {route.via.length ? route.via.join(", ") : "Direct"}
        </p>
        <p>
          <span className="font-medium text-gray-900">Fare:</span>{" "}
          {route.fare || "Not available"}
        </p>

        {route.notes && (
          <p className="border-t border-gray-100 pt-2 text-xs leading-relaxed text-gray-500">
            {route.notes}
          </p>
        )}
      </div>
    </div>
  );
}