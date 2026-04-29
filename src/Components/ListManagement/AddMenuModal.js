/**
 * ADD MENU MODAL - Modal hiện menu thêm (folder/list/tag)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddMenuModal({
  visible,
  onCreateList,
  onCreateFolder,
  onCreateTag,
  onClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.container}>
        {/* NÚT THÊM DANH SÁCH */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onClose(); // 1. Đóng Menu ngay lập tức
            setTimeout(() => {
              onCreateList(); // 2. Đợi 350ms để Menu đóng xong mới mở Form List (Sửa lỗi Freeze)
            }, 350); 
          }}
        >
          <View style={[styles.iconBox, { backgroundColor: '#F0F8FF' }]}>
            <Ionicons name="list-outline" size={24} color="#2D9CDB" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Danh sách mới</Text>
            <Text style={styles.optionDesc}>Tạo một danh sách công việc</Text>
          </View>
        </TouchableOpacity>

        {/* NÚT THÊM THƯ MỤC */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onClose(); 
            setTimeout(() => {
              onCreateFolder(); 
            }, 350);
          }}
        >
          <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="folder-outline" size={24} color="#F2994A" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Thư mục mới</Text>
            <Text style={styles.optionDesc}>Tạo một thư mục để sắp xếp</Text>
          </View>
        </TouchableOpacity>

        {/* NÚT THÊM THẺ (TAG) */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onClose();
            setTimeout(() => {
              onCreateTag(); 
            }, 350);
          }}
        >
          <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
            <Ionicons name="pricetag-outline" size={24} color="#828282" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Thẻ mới</Text>
            <Text style={styles.optionDesc}>Thêm một thẻ để phân loại</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 40,
    left: 12,
    right: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 13,
    color: '#999',
  },
});