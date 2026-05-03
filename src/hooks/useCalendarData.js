import { useMemo } from 'react';
import dayjs from 'dayjs';

const PRIORITY_COLORS = { 0: '#828282', 1: '#2D9CDB', 3: '#F2994A', 5: '#EB5757' };

export const useCalendarData = (tasks) => {
  const { itemsByDate, markedDates, mappedData } = useMemo(() => {
    const items = {};
    const marks = {};
    const gridItems = []; 

    const pushToDate = (dateStr, itemData) => {
      if (!items[dateStr]) items[dateStr] = [];
      items[dateStr].push(itemData);

      if (!marks[dateStr]) {
        marks[dateStr] = { 
          marked: true, 
          dotColor: itemData.isEvent ? '#F2994A' : (itemData.isCompleted ? '#C0C0C0' : PRIORITY_COLORS[itemData.priority] || '#2D9CDB') 
        };
      }
    };

    (tasks || []).forEach(task => {
      if (task.isTrashed || task.isWontDo) return;
      
      // 🚀 ĐÃ FIX: Chỉ ẩn task khi nó KHÔNG CÓ GIỜ và KHÔNG BẬT "CẢ NGÀY" và KHÔNG PHẢI SỰ KIỆN
      if (!task.isEvent && !task.isAllDay && !task.startTime && !task.endTime) return;

      const start = dayjs(task.startDate || task.dueDate);
      const end = dayjs(task.endDate || task.dueDate);
      if (!start.isValid()) return;

      const isMultiDay = end.isValid() && start.format('YYYY-MM-DD') !== end.format('YYYY-MM-DD');
      const taskColor = task.isCompleted ? '#C0C0C0' : (PRIORITY_COLORS[task.priority] || '#828282');

      // 1. Phân bổ cho Lịch Danh Sách (Agenda)
      const baseItem = { ...task, isAllDayOrNoTime: task.isAllDay, color: taskColor };
      if (isMultiDay) {
        let currentDay = start.clone();
        while (currentDay.isBefore(end) || currentDay.isSame(end, 'day')) {
          pushToDate(currentDay.format('YYYY-MM-DD'), baseItem);
          currentDay = currentDay.add(1, 'day');
        }
      } else {
        pushToDate(start.format('YYYY-MM-DD'), baseItem);
      }

      // 2. Phân bổ cho Lịch Lưới Giờ (Grid)
      if (task.isAllDay) {
        // 🚀 ĐÃ FIX: Task cả ngày được gom lên dải 00:00 - 01:00 để nằm gọn trên cùng
        let currentDay = start.clone();
        while (currentDay.isBefore(end) || currentDay.isSame(end, 'day')) {
          gridItems.push({
            ...task,
            start: currentDay.hour(0).minute(0).second(0).toDate(),
            end: currentDay.hour(1).minute(0).second(0).toDate(),
            isTask: !task.isEvent,
            isEvent: task.isEvent,
            isAllDayItem: true, // Cờ khóa kéo thả
            color: task.isEvent ? '#F2994A' : taskColor,
            title: task.isEvent ? `[Sự kiện] ${task.title}` : `[Cả ngày] ${task.title}`
          });
          currentDay = currentDay.add(1, 'day');
        }
      } else {
        // Task có khung giờ cụ thể
        const sHour = task.startTime ? dayjs(task.startTime).hour() : 8;
        const sMinute = task.startTime ? dayjs(task.startTime).minute() : 0;
        const eHour = task.endTime ? dayjs(task.endTime).hour() : sHour + 1;
        const eMinute = task.endTime ? dayjs(task.endTime).minute() : sMinute;

        if (isMultiDay) {
          let currentDay = start.clone();
          while (currentDay.isBefore(end) || currentDay.isSame(end, 'day')) {
            gridItems.push({
              ...task,
              start: currentDay.hour(sHour).minute(sMinute).toDate(),
              end: currentDay.hour(eHour).minute(eMinute).toDate(),
              isTask: !task.isEvent,
              isEvent: task.isEvent,
              color: task.isEvent ? '#F2994A' : taskColor,
              title: task.isEvent ? `[Sự kiện] ${task.title}` : task.title
            });
            currentDay = currentDay.add(1, 'day');
          }
        } else {
          gridItems.push({
            ...task, 
            start: start.hour(sHour).minute(sMinute).toDate(), 
            end: start.hour(eHour).minute(eMinute).toDate(),
            isTask: !task.isEvent,
            isEvent: task.isEvent,
            color: task.isEvent ? '#F2994A' : taskColor,
            title: task.isEvent ? `[Sự kiện] ${task.title}` : task.title
          });
        }
      }
    });

    // Sắp xếp Lịch Danh Sách: Cả ngày lên trước, Giờ giấc theo sau
    Object.keys(items).forEach(date => {
      items[date].sort((a, b) => {
        if (a.isAllDayOrNoTime && !b.isAllDayOrNoTime) return -1;
        if (!a.isAllDayOrNoTime && b.isAllDayOrNoTime) return 1;
        if (a.startTime && b.startTime) return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf();
        return 0;
      });
    });

    return { itemsByDate: items, markedDates: marks, mappedData: gridItems };
  }, [tasks]);

  return { itemsByDate, markedDates, mappedData };
};