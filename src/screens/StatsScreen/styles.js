import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFBFF', 
    paddingHorizontal: 20,
    paddingTop: 10
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333' 
  },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#E3F2FD', 
    borderRadius: 10, 
    padding: 5, 
    marginBottom: 20 
  },
  tab: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: 8 
  },
  activeTab: { 
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2 
  },
  tabText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#888' 
  },
  activeTabText: { 
    color: '#2D9CDB' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  statCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    flex: 1, 
    marginHorizontal: 5, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2 
  },
  statLabel: { 
    fontSize: 12, 
    color: '#888', 
    marginBottom: 5 
  },
  statValue: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  chartCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2, 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 12, 
    color: '#888', 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  chartValue: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#333' 
  },
  
  /* --- PHẦN CODE MỚI DÀNH RIÊNG CHO BIỂU ĐỒ BÁO CÁO --- */
  chartContainer: {
    flexDirection: 'row',
    height: 180,
    marginTop: 10,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingBottom: 20, // Chừa khoảng trống ngang hàng với chữ T2, T3
  },
  yAxisText: {
    fontSize: 10,
    color: '#A0A0A0',
    fontWeight: '500'
  },
  chartContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'relative',
  },
  gridLineContainer: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    bottom: 25, // Khớp với chiều cao tối đa của cột
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
  },
  barColumn: { 
    alignItems: 'center', 
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end'
  },
  barTrack: {
    width: 14, // Độ rộng cột
    height: 140, // Chiều cao tối đa của cột
    backgroundColor: '#F5F5F5', // Màu nền xám nhạt
    borderRadius: 7,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: { 
    width: 14, 
    borderRadius: 7, 
  },
  dayLabel: { 
    fontSize: 12, 
    color: '#888',
    fontWeight: '500'
  },
  activeDayLabel: {
    color: '#2D9CDB',
    fontWeight: 'bold'
  },
  /* ---------------------------------------------------- */

  recentTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginTop: 5, 
    color: '#333' 
  },
  activityItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1
  },
  activityIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  activityText: { 
    flex: 1, 
    fontSize: 15, 
    color: '#333', 
    fontWeight: '500' 
  },
  activityTime: { 
    fontSize: 12, 
    color: '#888' 
  }
});