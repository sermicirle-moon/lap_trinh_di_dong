/**
 * CONTEXT MENU - Menu ẩn phải (long press)
 * Hiển thị các tùy chọn: Edit, Delete, Create List (cho folder), etc.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContextMenu({
  visible,
  item,
  itemType, // 'list', 'folder', 'tag'
  onEdit,
  onDelete,
  onCreateListInFolder,
  onClose,
}) {
  const handleDelete = () => {
    onClose();
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa "${item?.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => onDelete(),
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.container}>
        {/* Show "Add List" option only for folders */}
        {itemType === 'folder' && (
          <>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onCreateListInFolder();
                onClose();
              }}
            >
              <Ionicons name="add-outline" size={20} color="#2D9CDB" />
              <Text style={styles.optionText}>Thêm danh sách</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        )}

        {/* Edit option */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onEdit();
            onClose();
          }}
        >
          <Ionicons name="pencil-outline" size={20} color="#666" />
          <Text style={styles.optionText}>Sửa</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Delete option */}
        <TouchableOpacity
          style={[styles.option, styles.deleteOption]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#EB5757" />
          <Text style={[styles.optionText, styles.deleteText]}>Xóa</Text>
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
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
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
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  deleteOption: {},
  deleteText: {
    color: '#EB5757',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});
