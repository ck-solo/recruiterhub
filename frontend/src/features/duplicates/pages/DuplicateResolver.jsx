import { useState } from "react";
import { useGetDuplicatesQuery, useResolveDuplicateMutation } from "../api/duplicate.api.js";
import { FiCheckCircle, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";
import DuplicateTable from "../components/DuplicateTable.jsx";
import DuplicateCard from "../components/DuplicateCard.jsx";
import PageHeader from "../../../shared/components/PageHeader.jsx";
import Loader from "../../../shared/components/Loader.jsx";
import ErrorState from "../../../shared/components/ErrorState.jsx";
import EmptyState from "../../../shared/components/EmptyState.jsx";

function DuplicateResolver() {
  const { data: response, isLoading, error, refetch } = useGetDuplicatesQuery();
  const [resolveDuplicate, { isLoading: isResolving }] = useResolveDuplicateMutation();

  // State to hold selected group and selected duplicate index
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedDupIndex, setSelectedDupIndex] = useState(0);

  const duplicateGroups = response?.data || [];

  // Get current active group
  const activeGroup = duplicateGroups.find(g => g._id === selectedGroupId) || duplicateGroups[0];

  // Set default selection if not set
  if (duplicateGroups.length > 0 && !selectedGroupId) {
    setSelectedGroupId(duplicateGroups[0]._id);
    setSelectedDupIndex(0);
  }

  const handleResolveUnique = async (dupId) => {
    try {
      await resolveDuplicate({ id: dupId, action: "resolve_unique" }).unwrap();
      toast.success("Listing marked as a unique canonical job.");
      
      // Reset index pointers if necessary
      if (activeGroup && activeGroup.duplicates.length <= 1) {
        setSelectedGroupId(null);
      } else {
        setSelectedDupIndex(0);
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update record status.");
    }
  };

  const handleConfirmDuplicate = async (dupId) => {
    try {
      await resolveDuplicate({ id: dupId, action: "confirm" }).unwrap();
      toast.success("Duplicate status verified.");
      
      // Advance to next or wrap up
      if (activeGroup && selectedDupIndex < activeGroup.duplicates.length - 1) {
        setSelectedDupIndex(prev => prev + 1);
      } else {
        toast.info("Reached the end of this duplicate group.");
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to verify duplicate.");
    }
  };

  if (isLoading) {
    return <Loader message="Scanning database for duplicate groups..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error scanning duplicates"
        message={error?.data?.message || "Communication failed."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Duplicate Records Resolver"
        subtitle="Review potential near-duplicate jobs detected during imports. Verify duplicates or re-classify them as unique canonical postings."
      />

      {duplicateGroups.length === 0 ? (
        <EmptyState
          title="All Clean! No Duplicates Detected"
          message="The duplicate detection engine has found 0 near-duplicate sets in your MongoDB dataset. Try importing new spreadsheets."
          icon={
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full w-fit mx-auto">
              <FiCheckCircle size={32} />
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[72vh]">
          {/* Duplicate Groups Sidebar */}
          <DuplicateTable
            duplicateGroups={duplicateGroups}
            selectedGroupId={selectedGroupId}
            onSelectGroup={(id) => {
              setSelectedGroupId(id);
              setSelectedDupIndex(0);
            }}
          />

          {/* Side-by-side Comparison Area */}
          <div className="lg:col-span-2 flex flex-col h-full gap-6 overflow-hidden">
            {activeGroup && (
              <>
                {/* Tabs to select active duplicate within group */}
                {activeGroup.duplicates.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
                    {activeGroup.duplicates.map((dup, idx) => (
                      <button
                        key={dup._id}
                        onClick={() => setSelectedDupIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition ${
                          selectedDupIndex === idx
                            ? "bg-emerald-600 text-white border-transparent"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500"
                        }`}
                      >
                        Duplicate Match {idx + 1} ({(dup.duplicateScore * 100).toFixed(0)}% Match)
                      </button>
                    ))}
                  </div>
                )}

                {/* Side-by-side View */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto min-h-0 pr-1">
                  {/* Canonical Panel */}
                  <DuplicateCard
                    job={activeGroup.canonical}
                    variant="canonical"
                  />

                  {/* Duplicate Panel */}
                  {activeGroup.duplicates[selectedDupIndex] && (
                    <DuplicateCard
                      job={activeGroup.duplicates[selectedDupIndex]}
                      variant="duplicate"
                      canonicalJob={activeGroup.canonical}
                      duplicateScore={activeGroup.duplicates[selectedDupIndex].duplicateScore}
                    />
                  )}
                </div>

                {/* Resolution Action Footer */}
                {activeGroup.duplicates[selectedDupIndex] && (
                  <div className="glass-card bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 shadow-md">
                    <div className="flex items-center gap-2.5 text-slate-500 text-xs">
                      <FiInfo size={16} className="text-emerald-500 shrink-0" />
                      <p>
                        Confirm duplicate status to retain current grouping, or split this record out as a unique posting.
                      </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => handleResolveUnique(activeGroup.duplicates[selectedDupIndex]._id)}
                        disabled={isResolving}
                        className="flex-1 sm:flex-none px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition active:scale-95 disabled:opacity-50"
                      >
                        Split (Mark Unique)
                      </button>
                      <button
                        onClick={() => handleConfirmDuplicate(activeGroup.duplicates[selectedDupIndex]._id)}
                        disabled={isResolving}
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition active:scale-95 disabled:opacity-50"
                      >
                        Confirm Duplicate
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DuplicateResolver;
