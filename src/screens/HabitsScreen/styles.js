import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFBFF' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600' 
  },
  scroll: { 
    paddingHorizontal: 20 
  },
  calendarStrip: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 30 
  },
  dayItem: { 
    alignItems: 'center', 
    padding: 10 
  },
  dayText: { 
    color: '#888', 
    fontSize: 16 
  },
  activeDay: { 
    backgroundColor: '#2D9CDB', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 10 
  },
  activeDayText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  viewAll: { 
    color: '#2D9CDB', 
    fontSize: 14 
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 2 
  },
  iconBg: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardInfo: { 
    flex: 1, 
    marginLeft: 15 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  cardStreak: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 4 
  },
  checkbox: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#eee', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  checkedBox: { 
    backgroundColor: '#2D9CDB', 
    borderColor: '#2D9CDB' 
  },
  statsCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 2, 
    marginBottom: 80 
  },
  heatmap: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    justifyContent: 'center', 
    marginBottom: 15 
  },
  heatBox: { 
    width: 30, 
    height: 30, 
    backgroundColor: '#2D9CDB', 
    borderRadius: 4 
  },
  completionRate: { 
    color: '#666', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  fab: { 
    position: 'absolute', 
    right: 20, 
    bottom: 20, 
    backgroundColor: '#2D9CDB', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#2D9CDB', 
    shadowOpacity: 0.4, 
    shadowRadius: 10, 
    elevation: 5 
  }
});