/**
 * LIST COLOR PICKER - Bản Fix lỗi hiển thị bẹp dí và xếp lộn xộn
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Thêm icon checkmark

// Bảng màu chuẩn chuyên nghiệp hơn
const COLORS = [
  '#2D9CDB', '#27AE60', '#F2994A', '#EB5757', 
  '#9B51E0', '#50E3C2', '#F5A623', '#828282',
  '#F06292', '#AED581', '#7986CB', '#4DD0E1' // Thêm vài màu cho đầy đặn
];

export default function ListColorPicker({ visible, onClose, onSelectColor, currentColor }) {
  if (!visible) return null; 

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onClose}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Màu sắc danh sách</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color="#999" />
            </TouchableOpacity>
        </View>
        
        {/* LƯỚI Ô MÀU ĐÃ FIX */}
        <View style={styles.colorGrid}>
          {COLORS.map((color) => {
            const isSelected = currentColor === color;
            return (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  // Thêm shadow nhẹ cho ô màu
                  styles.shadowProp
                ]}
                onPress={() => {
                  onSelectColor(color);
                  // Không đóng ngay để người dùng thấy màu đã chọn
                }}
              >
                {/* Hiển thị checkmark màu trắng khi được chọn */}
                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark" size={20} color="#FFF" />
                    </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={onClose}>
            <Text style={styles.confirmBtnText}>Hoàn tất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
// Tính toán kích thước ô màu cố định dựa trên màn hình để xếp đủ 4 ô 1 hàng mượt mà
const CONTAINER_PADDING = 25;
const GRID_GAP = 20;
const ITEM_SIZE = (width - (CONTAINER_PADDING * 2) - (GRID_GAP * 3)) / 4;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // Đảm bảo nổi lên trên cùng
    elevation: 9999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Tối hơn tí cho nổi bật modal
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: CONTAINER_PADDING,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30, // Thêm padding cho iOS
    // Shadow cho container modal
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  closeBtn: {
    padding: 5,
  },

  // 👇 PHẦN FIX CHÍNH: LƯỚI Ô MÀU STABLE
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Sử dụng gap cố định thay vì justify-around
    gap: GRID_GAP, 
    justifyContent: 'flex-start', // Luôn xếp từ trái sang
    marginBottom: 30,
  },
  colorCircle: {
    // Kích thước cố định (đã tính toán)
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2, // Bo tròn hoàn hảo
    justifyContent: 'center',
    alignItems: 'center',
    // Bỏ borderWidth cũ gây nhảy layout
    position: 'relative', 
  },
  // Hiệu ứng khi được chọn: dùng overlay thay vì border
  selectedIndicator: {
    width: '100%',
    height: '100%',
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: 'rgba(0,0,0,0.2)', // Làm tối màu nền 1 chút
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF', // Vòng tròn trắng bao quanh checkmark
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  confirmBtn: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  }
});