/**
 * LIST MANAGER - Component chính quản lý hiển thị tất cả list/folder
 * Sử dụng hook useListManagement và các component con
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useListManagement } from '../../hooks/useListManagement';
import ListItem from './ListItem';
import ContextMenu from './ContextMenu';
import ListForm from './ListForm';
import FolderForm from './FolderForm';
import TagForm from './TagForm';
import AddMenuModal from './AddMenuModal';

const SMART_LISTS = [
  { id: 'inbox', icon: 'mail', title: 'Hộp thư đến', color: '#2D9CDB' },
  { id: 'today', icon: 'calendar', title: 'Hôm nay', color: '#27AE60' },
  { id: 'next7', icon: 'calendar-outline', title: '7 ngày tới', color: '#F2994A' },
  { id: 'done', icon: 'checkmark-done-circle', title: 'Đã hoàn thành', color: '#9B51E0' },
  { id: 'trash', icon: 'trash', title: 'Thùng rác', color: '#828282' },
];

export default function ListManager({ onSelectList, navigation }) {
  const {
    folders,
    tags,
    smartLists,
    isLoading,
    expandedFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    createList,
    createListInFolder,
    updateList,
    deleteList,
    createTag,
    updateTag,
    deleteTag,
    toggleFolder,
  } = useListManagement();

  // ===== STATE =====
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, item: null, type: null });
  const [editingItem, setEditingItem] = useState({ visible: false, type: null, item: null, mode: 'create' });

  // ===== LIST FORM =====
  const [showListForm, setShowListForm] = useState(false);
  const [listFormMode, setListFormMode] = useState('create');
  const [selectedListToEdit, setSelectedListToEdit] = useState(null);

  // ===== FOLDER FORM =====
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [folderFormMode, setFolderFormMode] = useState('create');
  const [selectedFolderToEdit, setSelectedFolderToEdit] = useState(null);
  const [folderForNewList, setFolderForNewList] = useState(null);

  // ===== TAG FORM =====
  const [showTagForm, setShowTagForm] = useState(false);
  const [tagFormMode, setTagFormMode] = useState('create');
  const [selectedTagToEdit, setSelectedTagToEdit] = useState(null);

  // ===== HANDLERS =====

  const handleAddList = () => {
    setListFormMode('create');
    setSelectedListToEdit(null);
    setFolderForNewList(null);
    setShowListForm(true);
  };

  const handleAddFolder = () => {
    setFolderFormMode('create');
    setSelectedFolderToEdit(null);
    setShowFolderForm(true);
  };

  const handleAddTag = () => {
    setTagFormMode('create');
    setSelectedTagToEdit(null);
    setShowTagForm(true);
  };

  const handleSaveList = async (data) => {
    try {
      if (listFormMode === 'create') {
        if (folderForNewList) {
          await createListInFolder(folderForNewList, data.title, data.color);
        } else {
          await createList(data.title, data.color, data.icon);
        }
      } else {
        await updateList(selectedListToEdit.id, data);
      }
      setShowListForm(false);
    } catch (error) {
      console.error('Error saving list:', error);
    }
  };

  const handleSaveFolder = async (data) => {
    try {
      if (folderFormMode === 'create') {
        await createFolder(data.title, data.icon, data.color);
      } else {
        await updateFolder(selectedFolderToEdit.id, data);
      }
      setShowFolderForm(false);
    } catch (error) {
      console.error('Error saving folder:', error);
    }
  };

  const handleSaveTag = async (data) => {
    try {
      if (tagFormMode === 'create') {
        await createTag(data.title, data.color);
      } else {
        await updateTag(selectedTagToEdit.id, data);
      }
      setShowTagForm(false);
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleEditItem = () => {
    const { type, item } = contextMenu;

    if (type === 'list') {
      setListFormMode('edit');
      setSelectedListToEdit(item);
      setShowListForm(true);
    } else if (type === 'folder') {
      setFolderFormMode('edit');
      setSelectedFolderToEdit(item);
      setShowFolderForm(true);
    } else if (type === 'tag') {
      setTagFormMode('edit');
      setSelectedTagToEdit(item);
      setShowTagForm(true);
    }
  };

  const handleDeleteItem = async () => {
    const { type, item } = contextMenu;

    try {
      if (type === 'list') {
        await deleteList(item.id);
      } else if (type === 'folder') {
        await deleteFolder(item.id);
      } else if (type === 'tag') {
        await deleteTag(item.id);
      }
      setContextMenu({ visible: false, item: null, type: null });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddListToFolder = () => {
    setListFormMode('create');
    setSelectedListToEdit(null);
    setFolderForNewList(contextMenu.item.id);
    setShowListForm(true);
  };

  const handleListPress = (list) => {
    onSelectList?.(list);
  };

  // ===== RENDER =====

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* SMART LISTS */}
        <Text style={styles.sectionTitle}>Mặc định</Text>
        {SMART_LISTS.map(list => (
          <ListItem
            key={list.id}
            icon={list.icon}
            title={list.title}
            count={smartLists[list.id]?.length || 0}
            color={list.color}
            isSmart
            onPress={() => handleListPress({ id: list.id, title: list.title, tasks: smartLists[list.id] || [] })}
          />
        ))}

        <View style={styles.divider} />

        {/* FOLDERS & LISTS */}
        <Text style={styles.sectionTitle}>Danh sách</Text>

        {isLoading && folders.length === 0 ? (
          <ActivityIndicator size="small" color="#2D9CDB" style={{ marginTop: 20 }} />
        ) : folders.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có danh sách. Bấm + để thêm mới!</Text>
        ) : (
          folders.map(item => {
            if (item.isFolder) {
              const isExpanded = expandedFolders[item.id];
              return (
                <View key={item.id}>
                  <ListItem
                    icon={item.icon || 'folder-outline'}
                    title={item.title}
                    color={item.color}
                    isFolder
                    isExpanded={isExpanded}
                    onPress={() => toggleFolder(item.id)}
                    onLongPress={() => setContextMenu({ visible: true, item, type: 'folder' })}
                  />
                  {isExpanded && item.lists && item.lists.map(list => (
                    <ListItem
                      key={list.id}
                      icon={list.icon || 'list-outline'}
                      title={list.title}
                      count={list.tasks?.length || 0}
                      color={list.color}
                      isSubItem
                      onPress={() => handleListPress(list)}
                      onLongPress={() => setContextMenu({ visible: true, item: list, type: 'list' })}
                    />
                  ))}
                </View>
              );
            } else {
              return (
                <ListItem
                  key={item.id}
                  icon={item.icon || 'list-outline'}
                  title={item.title}
                  count={item.tasks?.length || 0}
                  color={item.color}
                  onPress={() => handleListPress(item)}
                  onLongPress={() => setContextMenu({ visible: true, item, type: 'list' })}
                />
              );
            }
          })
        )}

        <View style={styles.divider} />

        {/* TAGS */}
        <Text style={styles.sectionTitle}>Thẻ (Tags)</Text>
        {tags.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có thẻ nào.</Text>
        ) : (
          tags.map(tag => (
            <ListItem
              key={tag.id}
              icon="pricetag-outline"
              title={tag.title}
              color={tag.color}
              onPress={() => {}}
              onLongPress={() => setContextMenu({ visible: true, item: tag, type: 'tag' })}
            />
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ADD BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddMenu(true)}>
          <Ionicons name="add-outline" size={24} color="#2D9CDB" />
          <Text style={styles.addBtnText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {/* MODALS */}
      <AddMenuModal
        visible={showAddMenu}
        onCreateList={handleAddList}
        onCreateFolder={handleAddFolder}
        onCreateTag={handleAddTag}
        onClose={() => setShowAddMenu(false)}
      />

      <ListForm
        visible={showListForm}
        mode={listFormMode}
        initialData={selectedListToEdit}
        onSave={handleSaveList}
        onCancel={() => setShowListForm(false)}
      />

      <FolderForm
        visible={showFolderForm}
        mode={folderFormMode}
        initialData={selectedFolderToEdit}
        onSave={handleSaveFolder}
        onCancel={() => setShowFolderForm(false)}
      />

      <TagForm
        visible={showTagForm}
        mode={tagFormMode}
        initialData={selectedTagToEdit}
        onSave={handleSaveTag}
        onCancel={() => setShowTagForm(false)}
      />

      <ContextMenu
        visible={contextMenu.visible}
        item={contextMenu.item}
        itemType={contextMenu.type}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onCreateListInFolder={handleAddListToFolder}
        onClose={() => setContextMenu({ visible: false, item: null, type: null })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontStyle: 'italic',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 12,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D9CDB',
    marginLeft: 8,
  },
});
