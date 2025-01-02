"use strict";
class Person {
    constructor(id, name, email, phone) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._phone = phone;
    }
    get id() {
        return this._id;
    }
    getDetails() {
        return `ID: ${this._id}, Name: ${this._name}, Email: ${this._email}, Phone: ${this._phone}`;
    }
}
class Room {
    constructor(roomId, type, pricePerNight) {
        this._roomId = roomId;
        this._type = type;
        this._pricePerNight = pricePerNight;
        this._isAvailable = true;
    }
    get roomId() {
        return this._roomId;
    }
    get type() {
        return this._type;
    }
    get isAvailable() {
        return this._isAvailable;
    }
    bookRoom() {
        this._isAvailable = false;
    }
    releaseRoom() {
        this._isAvailable = true;
    }
}
class StandardRoom extends Room {
    constructor(roomId, pricePerNight) {
        super(roomId, "Standard", pricePerNight);
    }
    calculateCost(nights) {
        return this._pricePerNight * nights;
    }
    getAdditionalServices() {
        return [];
    }
    applyDiscount(discountRate) {
        return this._pricePerNight * (1 - discountRate);
    }
    getCancellationPolicy() {
        return "Hoàn lại 100% nếu hủy trước 1 ngày.";
    }
}
class DeluxeRoom extends Room {
    constructor(roomId, pricePerNight) {
        super(roomId, "Deluxe", pricePerNight);
    }
    calculateCost(nights) {
        return this._pricePerNight * nights;
    }
    getAdditionalServices() {
        return ["1 lon tài lộc quá lớn"];
    }
    applyDiscount(discountRate) {
        return this._pricePerNight * (1 - discountRate);
    }
    getCancellationPolicy() {
        return "Hoàn lại 50% nếu hủy trước 2 ngày.";
    }
}
class SuiteRoom extends Room {
    constructor(roomId, pricePerNight) {
        super(roomId, "Suite", pricePerNight);
    }
    calculateCost(nights) {
        return this._pricePerNight * nights;
    }
    getAdditionalServices() {
        return ["Spa", "Minibar"];
    }
    applyDiscount(discountRate) {
        return this._pricePerNight * (1 - discountRate);
    }
    getCancellationPolicy() {
        return "Không hoàn lại tiền nếu hủy.";
    }
}
class Booking {
    constructor(bookingId, customer, room, nights) {
        this._bookingId = bookingId;
        this._customer = customer;
        this._room = room;
        this._nights = nights;
        this._totalCost = room.calculateCost(nights);
    }
    getDetails() {
        return `Mã đặt phòng: ${this._bookingId}, Khách hàng: ${this._customer.getDetails()}, Loại phòng: ${this._room.type}, Số đêm: ${this._nights}, Tổng chi phí: ${this._totalCost}`;
    }
}
class HotelManager {
    constructor() {
        this._rooms = [];
        this._bookings = [];
        this._customers = [];
    }
    addRoom(type, pricePerNight) {
        const roomId = this._rooms.length + 1;
        let room;
        switch (type) {
            case "Standard":
                room = new StandardRoom(roomId, pricePerNight);
                break;
            case "Deluxe":
                room = new DeluxeRoom(roomId, pricePerNight);
                break;
            case "Suite":
                room = new SuiteRoom(roomId, pricePerNight);
                break;
            default:
                throw new Error("Loại phòng không hợp lệ.");
        }
        this._rooms.push(room);
    }
    addCustomer(name, email, phone) {
        const customerId = this._customers.length + 1;
        const customer = new Person(customerId, name, email, phone);
        this._customers.push(customer);
        return customer;
    }
    bookRoom(customerId, roomId, nights) {
        const customer = this._customers.find(c => c.id === customerId);
        const room = this._rooms.find(r => r.roomId === roomId);
        if (!customer || !room) {
            throw new Error("Không tìm thấy khách hàng, phòng");
        }
        if (!room.isAvailable) {
            throw new Error("Phòng không còn trống");
        }
        room.bookRoom();
        const booking = new Booking(this._bookings.length + 1, customer, room, nights);
        this._bookings.push(booking);
        return booking;
    }
    releaseRoom(roomId) {
        const room = this._rooms.find(r => r.roomId === roomId);
        if (room) {
            room.releaseRoom();
        }
        else {
            throw new Error("Không tìm thấy phòng");
        }
    }
    listAvailableRooms() {
        const availableRooms = this._rooms.filter(r => r.isAvailable);
        availableRooms.forEach(r => console.log(`Mã phòng: ${r.roomId}, Loại phòng: ${r.type}`));
    }
    listBookingsByCustomer(customerId) {
        const customerBookings = this._bookings.filter(b => b["_customer"].id === customerId);
        customerBookings.forEach(b => console.log(b.getDetails()));
    }
    calculateTotalRevenue() {
        return this._bookings.reduce((total, booking) => total + booking["_totalCost"], 0);
    }
    getRoomTypesCount() {
        const roomTypesCount = this._rooms.reduce((count, room) => {
            count[room.type] = (count[room.type] || 0) + 1;
            return count;
        }, {});
        console.log(roomTypesCount);
    }
    applyDiscountToRoom(roomId, discountRate) {
        const roomIndex = this._rooms.findIndex(r => r.roomId === roomId);
        if (roomIndex !== -1) {
            const room = this._rooms[roomIndex];
            const discountedPrice = room.applyDiscount(discountRate);
            console.log(`Giá phòng sau khi giảm ${roomId}: ${discountedPrice}`);
        }
        else {
            throw new Error("Không tìm thấy phòng");
        }
    }
    getRoomServices(roomId) {
        const room = this._rooms.find(r => r.roomId === roomId);
        if (room) {
            console.log(`Dịch vụ ${roomId}: ${room.getAdditionalServices().join(", ")}`);
        }
        else {
            throw new Error("Không tìm thấy phòng.");
        }
    }
    getCancellationPolicy(roomId) {
        const room = this._rooms.find(r => r.roomId === roomId);
        if (room) {
            console.log(`Chính sách hủy phòng ${roomId}: ${room.getCancellationPolicy()}`);
        }
        else {
            throw new Error("Không tìm thấy phòng");
        }
    }
    run() {
        let running = true;
        while (running) {
            console.log("Hệ thống quản lý khách sạn");
            console.log("1. Thêm phòng");
            console.log("2. Thêm khách hàng");
            console.log("3. Đặt phòng");
            console.log("4. Hủy phòng");
            console.log("5. Xem danh sách phòng trống");
            console.log("6. Xem danh sách đặt phòng của khách hàng");
            console.log("7. Tính tổng doanh thu");
            console.log("8. Xem số lượng các loại phòng");
            console.log("9. Áp dụng giảm giá cho phòng");
            console.log("10. Xem dịch vụ phòng");
            console.log("11. Xem chính sách hủy phòng");
            console.log("12. Thoát");
            const choice = prompt("Chọn một tùy chọn:");
            switch (choice) {
                case "1":
                    const roomType = prompt("Nhập loại phòng: Standard,Deluxe,Suite:");
                    const roomPrice = parseFloat(prompt("Nhập giá phòng:") || "0");
                    if (roomType && roomPrice > 0) {
                        this.addRoom(roomType, roomPrice);
                        console.log("Thêm phòng thành công");
                    }
                    else {
                        console.log("Không hợp lệ");
                    }
                    break;
                case "2":
                    const customerName = prompt("Nhập tên:");
                    const customerEmail = prompt("Nhập email:");
                    const customerPhone = prompt("Nhập số điện thoại:");
                    if (customerName && customerEmail && customerPhone) {
                        const customer = this.addCustomer(customerName, customerEmail, customerPhone);
                        console.log(`Thành Công: ${customer.id}`);
                    }
                    else {
                        console.log("Sai");
                    }
                    break;
                case "3":
                    const customerId = parseInt(prompt("Nhập ID khách hàng:") || "0");
                    const roomId = parseInt(prompt("Nhập ID phòng:") || "0");
                    const nights = parseInt(prompt("Nhập số đêm:") || "0");
                    try {
                        const booking = this.bookRoom(customerId, roomId, nights);
                        console.log("Đặt thành công");
                    }
                    catch (error) {
                        console.log("Lỗi: " + error.message);
                    }
                    break;
                case "4":
                    const releaseRoomId = parseInt(prompt("Nhập ID phòng:") || "0");
                    try {
                        this.releaseRoom(releaseRoomId);
                        console.log("Hủy thành công");
                    }
                    catch (error) {
                        console.log("Lỗi: ");
                    }
                    break;
                case "5":
                    this.listAvailableRooms();
                    break;
                case "6":
                    const listCustomerId = parseInt(prompt("Nhập ID khách hàng:") || "0");
                    this.listBookingsByCustomer(listCustomerId);
                    break;
                case "7":
                    console.log("Tổng doanh thu:");
                    break;
                case "8":
                    this.getRoomTypesCount();
                    break;
                case "9":
                    const discountRoomId = parseInt(prompt("Nhập ID phòng:") || "0");
                    const discountRate = parseFloat(prompt("Giảm:") || "0");
                    this.applyDiscountToRoom(discountRoomId, discountRate);
                    break;
                case "10":
                    const servicesRoomId = parseInt(prompt("Nhập ID phòng:") || "0");
                    this.getRoomServices(servicesRoomId);
                    break;
                case "11":
                    const cancelRoomId = parseInt(prompt("Nhập ID phòng:") || "0");
                    this.getCancellationPolicy(cancelRoomId);
                    break;
                case "12":
                    running = false;
                    console.log("Thoát");
                    break;
                default:
                    console.log("Thử lại");
            }
        }
    }
}
const hotelManager = new HotelManager();
hotelManager.run();
