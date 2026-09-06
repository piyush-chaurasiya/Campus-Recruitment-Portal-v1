import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function AdminAcademicVerification() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/admin/academic/verifications"
      );

      setRequests(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load academic verification requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const approve = async (request) => {
    const confirmed = window.confirm(
      `Approve academic data submitted by ${request.studentName}?`
    );

    if (!confirmed) return;

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await api.put(
        `/api/admin/academic/verifications/${request.requestId}/approve`
      );

      setSuccess(
        `${request.studentName}'s academic data has been approved.`
      );

      setSelected(null);

      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to approve request."
      );
    } finally {
      setProcessing(false);
    }
  };

  const reject = async (e) => {
    e.preventDefault();

    if (!rejecting) return;

    if (!reason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await api.put(
        `/api/admin/academic/verifications/${rejecting.requestId}/reject`,
        {
          reason: reason.trim(),
        }
      );

      setSuccess(
        `${rejecting.studentName}'s request has been rejected.`
      );

      setRejecting(null);
      setReason("");
      setSelected(null);

      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reject request."
      );
    } finally {
      setProcessing(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return requests;

    return requests.filter(
      (item) =>
        item.studentName
          ?.toLowerCase()
          .includes(q) ||
        item.studentEmail
          ?.toLowerCase()
          .includes(q)
    );
  }, [requests, search]);

  return (
    <div className="space-y-7">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

        <div>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            VERIFICATION
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            Academic Verification
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Review and verify student academic information.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          ↻ Refresh
        </button>

      </div>

      {/* ALERTS */}

      {error && (
        <Alert
          type="error"
          message={error}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
        />
      )}

      {/* SUMMARY */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <SummaryCard
          icon="⏳"
          title="Pending Requests"
          value={requests.length}
        />

        <SummaryCard
          icon="🎓"
          title="Students Awaiting Review"
          value={requests.length}
        />

        <SummaryCard
          icon="🔎"
          title="Showing"
          value={filteredRequests.length}
        />

      </div>

      {/* SEARCH */}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search student name or email..."
          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 text-slate-900 dark:text-white"
        />

      </div>

      {/* REQUEST LIST */}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">

          <h2 className="text-lg font-bold">
            Pending Verification Requests
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review student-submitted academic records before approval.
          </p>

        </div>

        {loading ? (

          <div className="p-5 space-y-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}

          </div>

        ) : filteredRequests.length === 0 ? (

          <div className="py-20 text-center">

            <div className="text-5xl">
              🎉
            </div>

            <h3 className="text-lg font-bold mt-4">
              No pending requests
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              All academic verification requests have been reviewed.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-200 dark:divide-slate-800">

            {filteredRequests.map((request) => (

              <div
                key={request.requestId}
                className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                  {/* STUDENT */}

                  <div className="flex items-center gap-4 min-w-0">

                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      {request.studentName
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h3 className="font-bold truncate">
                          {request.studentName}
                        </h3>

                        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-bold">
                          PENDING
                        </span>

                      </div>

                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                        {request.studentEmail}
                      </p>

                    </div>

                  </div>

                  {/* ACADEMIC SNAPSHOT */}

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">

                    <AcademicValue
                      label="10th"
                      value={`${request.tenthPercentage}%`}
                    />

                    <AcademicValue
                      label="12th"
                      value={`${request.twelfthPercentage}%`}
                    />

                    <AcademicValue
                      label="CGPA"
                      value={request.cgpa}
                    />

                    <AcademicValue
                      label="Backlogs"
                      value={request.backlogs}
                    />

                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        setSelected(request)
                      }
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      👁️ Review
                    </button>

                    <button
                      disabled={processing}
                      onClick={() =>
                        approve(request)
                      }
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold disabled:opacity-50 transition"
                    >
                      ✓ Approve
                    </button>

                    <button
                      disabled={processing}
                      onClick={() => {
                        setReason("");
                        setRejecting(request);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                    >
                      ✕ Reject
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* REVIEW MODAL */}

      {selected && (
        <ReviewModal
          request={selected}
          processing={processing}
          onClose={() =>
            setSelected(null)
          }
          onApprove={() =>
            approve(selected)
          }
          onReject={() => {
            setReason("");
            setRejecting(selected);
          }}
        />
      )}

      {/* REJECT MODAL */}

      {rejecting && (
        <RejectModal
          request={rejecting}
          reason={reason}
          setReason={setReason}
          processing={processing}
          onClose={() => {
            setRejecting(null);
            setReason("");
          }}
          onSubmit={reject}
        />
      )}

    </div>
  );
}

/* =====================================================
   REVIEW MODAL
===================================================== */

function ReviewModal({
  request,
  processing,
  onClose,
  onApprove,
  onReject,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl">

        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between gap-4">

          <div>

            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              ACADEMIC REVIEW
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {request.studentName}
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {request.studentEmail}
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xl"
          >
            ×
          </button>

        </div>

        <div className="p-6">

          <div className="grid sm:grid-cols-2 gap-4">

            <Detail
              label="10th Percentage"
              value={`${request.tenthPercentage}%`}
            />

            <Detail
              label="10th Mathematics"
              value={`${request.tenthMathPercentage}%`}
            />

            <Detail
              label="12th Percentage"
              value={`${request.twelfthPercentage}%`}
            />

            <Detail
              label="12th Mathematics"
              value={`${request.twelfthMathPercentage}%`}
            />

            <Detail
              label="CGPA"
              value={request.cgpa}
            />

            <Detail
              label="Backlogs"
              value={request.backlogs}
            />

            <Detail
              label="Submitted"
              value={formatDate(request.submittedAt)}
            />

            <Detail
              label="Request ID"
              value={`#${request.requestId}`}
            />

          </div>

          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">

            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
              ⚠️ Verification Required
            </p>

            <p className="text-xs text-amber-600/80 dark:text-amber-300/70 mt-1">
              Approving this request will copy these academic values into the student's verified profile.
            </p>

          </div>

        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">

          <button
            onClick={onReject}
            disabled={processing}
            className="flex-1 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold"
          >
            ✕ Reject
          </button>

          <button
            onClick={onApprove}
            disabled={processing}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50"
          >
            {processing
              ? "Processing..."
              : "✓ Approve Academic Data"}
          </button>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   REJECT MODAL
===================================================== */

function RejectModal({
  request,
  reason,
  setReason,
  processing,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 shadow-2xl"
      >

        <div className="flex justify-between">

          <div>

            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              REJECT REQUEST
            </p>

            <h2 className="text-2xl font-bold mt-1">
              Academic Verification
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xl"
          >
            ×
          </button>

        </div>

        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">

          <p className="font-semibold">
            {request.studentName}
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {request.studentEmail}
          </p>

        </div>

        <div className="mt-5">

          <label className="block text-sm font-semibold mb-2">
            Rejection Reason
          </label>

          <textarea
            required
            maxLength={500}
            rows={5}
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            placeholder="Explain why the academic data could not be verified..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 resize-none text-slate-900 dark:text-white"
          />

          <p className="text-xs text-slate-500 mt-2 text-right">
            {reason.length}/500
          </p>

        </div>

        <div className="flex gap-3 mt-6">

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            disabled={processing}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50"
          >
            {processing
              ? "Rejecting..."
              : "Reject Request"}
          </button>

        </div>

      </form>

    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function SummaryCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value}
      </p>

    </div>
  );
}

function AcademicValue({
  label,
  value,
}) {
  return (
    <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800">

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="font-bold text-sm mt-1">
        {value}
      </p>

    </div>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">

      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="font-bold text-lg mt-1">
        {value}
      </p>

    </div>
  );
}

function Alert({
  type,
  message,
}) {
  const success = type === "success";

  return (
    <div
      className={`p-4 rounded-xl border ${
        success
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
          : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
      }`}
    >
      {success ? "✓" : "⚠️"} {message}
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default AdminAcademicVerification;