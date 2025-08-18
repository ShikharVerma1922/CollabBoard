import React, { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useParams } from "react-router-dom";
import axios from "axios";

const PAGE_SIZE = 10;
const activityTypeOptions = [
  { value: "", label: "All Types" },
  { value: "CREATE_TASK", label: "Task created" },
  { value: "UPDATE_TASK", label: "Task updated" },
  { value: "MOVE_TASK", label: "Task moved" },
  { value: "DELETE_TASK", label: "Task Deleted" },
  { value: "UPDATE_TASK_STATUS", label: "Task status" },
];

function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupActivitiesByDate(activities) {
  return activities.reduce((acc, activity) => {
    let dateKey = "Unknown Date";
    if (activity.createdAt) {
      const d = new Date(activity.createdAt);
      dateKey = d.toLocaleDateString(undefined, {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });
    }
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(activity);
    return acc;
  }, {});
}

const BoardActivitiesPage = () => {
  const { workspaceId, boardId } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters (placeholders)
  const [activityType, setActivityType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchActivities = async () => {
    try {
      // Query params: page, pageSize, type, dateFrom, dateTo (if implemented server-side)
      let params = `?page=${page}&limit=${PAGE_SIZE}`;
      if (activityType) params += `&type=${encodeURIComponent(activityType)}`;
      if (dateFrom) params += `&from=${encodeURIComponent(dateFrom)}`;
      if (dateTo) params += `&to=${encodeURIComponent(dateTo)}`;
      const res = await axios.get(
        `${
          import.meta.env.VITE_SERVER
        }/workspaces/${workspaceId}/activities/boards/${boardId}${params}`,
        { withCredentials: true }
      );
      console.log(res.data.data);
      setActivities(res.data.data.activities || []);
      setTotalCount(res.data.data.totalDocs || 0);
    } catch (err) {
      setError("Failed to fetch activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setActivities([]);

    fetchActivities();
  }, [workspaceId, boardId, page, activityType, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Timeline line color
  const timelineLine = "border-l-2 border-gray-300";

  // Refresh handler
  const handleRefresh = () => {
    if (page !== 1) {
      setPage(1);
    } else {
      setLoading(true);
      setError(null);
      setActivities([]);
      fetchActivities();
    }
  };

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="min-h-screen py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Board Activities
            </h1>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={handleRefresh}
              title="Refresh"
            >
              <MdOutlineRefresh className="w-5 h-5" />
            </button>
          </div>
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              className="border rounded px-2 py-1 text-sm bg-white dark:bg-black"
              value={activityType}
              onChange={(e) => {
                setActivityType(e.target.value);
                setPage(1);
              }}
            >
              {activityTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="border rounded px-2 py-1 text-sm bg-white dark:bg-black"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              placeholder="From"
            />
            <input
              type="date"
              className="border rounded px-2 py-1 text-sm bg-white text-black dark:bg-black dark:text-white"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              placeholder="To"
            />
          </div>
        </div>

        {/* Activities Timeline */}
        <div className="bg-[var(--surface)] rounded-xl shadow p-6 min-h-[300px]">
          {loading && (
            <div className="flex justify-center items-center h-32 text-gray-500">
              Loading...
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}
          {!loading && !error && (
            <>
              {activities.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  No activities found.
                </div>
              )}
              {Object.entries(groupedActivities).map(([date, acts]) => (
                <div key={date}>
                  <div className="text-center text-sm font-semibold text-[var(--accent)] my-4">
                    {date}
                  </div>
                  <ol className="relative">
                    {acts.map((activity, idx) => (
                      <li
                        key={activity._id || idx}
                        className={`flex items-start gap-4 relative pb-10 ${
                          idx === acts.length - 1 ? "" : timelineLine
                        }`}
                      >
                        {/* Timeline dot */}
                        <span className="absolute left-0 top-0 -ml-3 flex items-center justify-center w-6 h-6 bg-white border-2 border-blue-400 rounded-full z-1">
                          {activity.actor?.avatarUrl ? (
                            <img
                              src={activity.actor.avatarUrl}
                              alt={activity.actor.fullName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          ) : (
                            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-bold">
                              {activity.actor?.fullName
                                ? activity.actor.fullName
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)
                                : "?"}
                            </span>
                          )}
                        </span>
                        {/* Card */}
                        <div className="ml-6 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-[var(--text)]">
                              {activity.actor?.fullName || "Someone"}
                            </span>
                            <span className="text-[var(--muted-text)] mr-2">
                              @{activity.actor?.username || ""}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-100 border border-blue-100">
                              {activity.type || "Activity"}
                            </span>
                          </div>
                          <div className="text-[var(--text)] mt-1 mb-1 text-sm">
                            {activity.message || ""}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDateTime(activity.createdAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            className={`px-3 py-1 rounded border text-sm ${
              page === 1
                ? "text-[var(--muted-text)] border-[var(--muted-text)] bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                : "text-blue-600 border-blue-200 hover:bg-blue-50"
            }`}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Newer
          </button>
          <span className="text-[var(--muted-text)] text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            className={`px-3 py-1 rounded border text-sm ${
              page >= totalPages
                ? "text-[var(--muted-text)] border-[var(--muted-text)] bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                : "text-blue-600 border-blue-200 hover:bg-blue-50"
            }`}
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Older
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardActivitiesPage;
