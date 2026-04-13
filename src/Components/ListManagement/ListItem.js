/**
 * LIST ITEM - Component hiển thị từng danh sách/folder trong sidebar
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ListItem({
  icon,
  title,
  count,
  color,
  onPress,
  onLongPress,
  isSubItem = false,
  isFolder = false,
  isExpanded = false,
  isSmart = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSubItem && styles.subItem,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      activeOpacity={0.6}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={isSmart ? 24 : 20}
          color={color}
          style={isSubItem && styles.subItemIcon}
        />
      </View>

      {/* Title */}
      <Text
        style={[
          styles.title,
          isSubItem && styles.subItemTitle,
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Right side: Count + Expand arrow */}
      <View style={styles.rightContainer}>
        {count > 0 && !isFolder && (
          <Text style={styles.count}>{count}</Text>
        )}
        {isFolder && (
          <Ionicons
            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
            size={18}
            color="#A0A0A0"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 10,
  },
  subItem: {
    paddingHorizontal: 20,
    marginHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  iconContainer: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subItemIcon: {
    marginLeft: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  subItemTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4F4F4F',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  count: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
});
