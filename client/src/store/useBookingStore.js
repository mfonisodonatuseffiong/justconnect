import { create } from "zustand";

const useBookingStore = create((set) => ({
  bookings: [],
  totalBookings: 0,
  statusCount: {},
  weeklyRequests: [],
  messages: 0,
  newBooking: null, // For notifications

  setBookings: (bookings) =>
    set((state) => {
      const statusCount = bookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {});
      const weeklyRequests = bookings.map((b) => ({
        day: new Date(b.date).toLocaleDateString("en-US", { weekday: "short" }),
        count: 1,
      }));

      return {
        bookings,
        totalBookings: bookings.length,
        statusCount,
        weeklyRequests,
      };
    }),

  addBooking: (booking) =>
    set((state) => {
      const updatedBookings = [booking, ...state.bookings];
      const statusCount = updatedBookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {});

      const weeklyRequests = updatedBookings.map((b) => ({
        day: new Date(b.date).toLocaleDateString("en-US", { weekday: "short" }),
        count: 1,
      }));

      return {
        bookings: updatedBookings,
        totalBookings: updatedBookings.length,
        statusCount,
        weeklyRequests,
        newBooking: booking,
      };
    }),

  clearNotification: () => set({ newBooking: null }),
}));

export default useBookingStore;
