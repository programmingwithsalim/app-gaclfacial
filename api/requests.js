import { api, apiRequest } from "./api";

export const login = (staffId, password) =>
  apiRequest(() => api.post("/auth/login", { staff_id: staffId, password }));

export const verifyFace = (faceImageBase64, staffId) => {
  const formData = new FormData();
  formData.append(
    "incoming_descriptor",
    `data:image/jpeg;base64,${faceImageBase64}`
  );
  formData.append("staff_id", staffId);

  return apiRequest(() =>
    api.post("/auth/verify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

export const takeAttendance = (staff_id, clock_in, clock_out, date) => {
  return apiRequest(() =>
    api.post("/auth/attendance", {
      staff_id,
      clock_in,
      clock_out,
      date,
    })
  );
};

export const editAttendance = (attednace_id, clock_out) => {
  return apiRequest(() =>
    api.put(`/auth/attendance/${attednace_id}`, {
      clock_out,
    })
  );
};
