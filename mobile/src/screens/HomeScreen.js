import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <Card style={styles.heroCard}>
          <Card.Content style={styles.heroContent}>
            <MaterialIcons name="bug-report" size={80} color="#667eea" />
            <Title style={styles.heroTitle}>Nhận Diện Sâu Bệnh AI</Title>
            <Paragraph style={styles.heroSubtitle}>
              Ứng dụng thông minh giúp nông dân nhận diện và xử lý sâu bệnh/côn trùng gây hại
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Features */}
        <Card style={styles.featureCard}>
          <Card.Content>
            <Title>🤖 AI Thông Minh</Title>
            <Paragraph>Nhận diện chính xác 102 loài côn trùng gây hại với độ chính xác 95%</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content>
            <Title>📱 Dễ Sử Dụng</Title>
            <Paragraph>Chụp ảnh trực tiếp hoặc upload từ thư viện, kết quả ngay lập tức</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.featureCard}>
          <Card.Content>
            <Title>🌱 Thân Thiện Môi Trường</Title>
            <Paragraph>Khuyến khích sử dụng phương pháp sinh học, hạn chế thuốc hóa học</Paragraph>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Camera')}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            <MaterialIcons name="camera-alt" size={24} color="white" style={styles.buttonIcon} />
            Chụp Ảnh Phân Tích
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('InsectList')}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.secondaryButtonLabel}
          >
            <MaterialIcons name="list" size={24} color="#667eea" style={styles.buttonIcon} />
            Danh Sách Côn Trùng
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('About')}
            style={styles.textButton}
            labelStyle={styles.textButtonLabel}
          >
            Tìm Hiểu Thêm
          </Button>
        </View>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.statsTitle}>Thống Kê</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>102</Title>
                <Paragraph style={styles.statLabel}>Loài Côn Trùng</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>95%</Title>
                <Paragraph style={styles.statLabel}>Độ Chính Xác</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumber}>24/7</Title>
                <Paragraph style={styles.statLabel}>Hỗ Trợ</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="camera"
        onPress={() => navigation.navigate('Camera')}
        label="Chụp Ảnh"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  heroCard: {
    marginBottom: 20,
    elevation: 4,
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
    lineHeight: 24,
  },
  featureCard: {
    marginBottom: 16,
    elevation: 2,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    marginBottom: 12,
    borderRadius: 8,
  },
  secondaryButton: {
    borderColor: '#667eea',
    marginBottom: 12,
    borderRadius: 8,
  },
  textButton: {
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  textButtonLabel: {
    fontSize: 16,
    color: '#667eea',
  },
  buttonIcon: {
    marginRight: 8,
  },
  statsCard: {
    marginTop: 20,
    elevation: 2,
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
});

export default HomeScreen;
