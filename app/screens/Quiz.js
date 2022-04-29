import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import {COLORS, SIZES} from '../constants';
import {data} from '../data/QuizData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Quiz = () => {
  const allQuestions = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setshowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));

  const validateAnswer = selectedOption => {
    let correct_answer = allQuestions[currentIndex].answer;
    setCurrentOptionSelected(selectedOption);
    setAnswer(correct_answer);
    setIsOptionDisabled(true);

    if (selectedOption === correct_answer) {
      setScore(score + 1);
    }
    setshowNextButton(true);
  };

  const handleNext = () => {
    if (currentIndex === allQuestions.length - 1) {
      setShowScoreModal(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setCurrentOptionSelected(null);
      setAnswer(null);
      setIsOptionDisabled(false);
      setshowNextButton(false);
    }
    Animated.timing(progress, {
      toValue: currentIndex + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const restartQuiz = () => {
    setShowScoreModal(false);
    setCurrentIndex(0);
    setScore(0);

    setCurrentOptionSelected(null);
    setAnswer(null);
    setIsOptionDisabled(false);
    setshowNextButton(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const progressAnim = progress.interpolate({
    inputRange: [0, allQuestions.length],
    outputRange: ['0%', '100%'],
  });
  const renderProgressBar = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 20,
          borderRadius: 20,
          backgroundColor: '#00000020',
        }}>
        <Animated.View
          style={[
            {
              height: 20,
              borderRadius: 20,
              backgroundColor: COLORS.accent,
            },
            {
              width: progressAnim,
            },
          ]}></Animated.View>
      </View>
    );
  };

  const renderQuestion = () => {
    return (
      <View>
        {/* Question Counter */}
        <View style={styles.questionCounter}>
          <Text style={{...styles.counterText, fontSize: 20, marginRight: 2}}>
            {currentIndex + 1}
          </Text>
          <Text style={{...styles.counterText, fontSize: 18}}>
            / {allQuestions.length}
          </Text>
        </View>

        {/* Question */}
        <Text style={styles.question}>
          {allQuestions[currentIndex]?.question}
        </Text>
      </View>
    );
  };

  const renderOptions = () => {
    return (
      <View style={{marginTop: 30}}>
        {allQuestions[currentIndex]?.options.map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => validateAnswer(option)}
            disabled={isOptionDisabled}
            style={{
              ...styles.optionBox,
              borderColor:
                option === answer
                  ? COLORS.success
                  : option === currentOptionSelected
                  ? COLORS.error
                  : COLORS.secondary + '40',
              backgroundColor:
                option === answer
                  ? COLORS.success + '20'
                  : option === currentOptionSelected
                  ? COLORS.error + '20'
                  : COLORS.secondary + '20',
            }}>
            <Text style={styles.option}>{option}</Text>

            {/* Show check or cross icon based on correct answer */}
            {option === answer ? (
              <View
                style={{
                  ...styles.statusOption,
                  backgroundColor: COLORS.success,
                }}>
                <MaterialCommunityIcons
                  name="check"
                  style={styles.statusOptionIcon}
                />
              </View>
            ) : option === currentOptionSelected ? (
              <View
                style={{...styles.statusOption, backgroundColor: COLORS.error}}>
                <MaterialCommunityIcons
                  name="check"
                  style={styles.statusOptionIcon}
                />
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderNextButton = () => {
    if (showNextButton) {
      return (
        <TouchableOpacity onPress={handleNext} style={styles.buttonBox}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.main}>
        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Question */}
        {renderQuestion()}

        {/* Options */}
        {renderOptions()}

        {/* Next Button */}
        {renderNextButton()}

        {/* Score Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showScoreModal}>
          <View style={styles.modalBox}>
            <View style={styles.modalBox2}>
              <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                {score > allQuestions.length / 2 ? 'Congratulations!' : 'Oops!'}
              </Text>

              <View style={styles.modalBox3}>
                <Text
                  style={{
                    fontSize: 30,
                    color:
                      score > allQuestions.length / 2
                        ? COLORS.success
                        : COLORS.error,
                  }}>
                  {score}
                </Text>
                <Text style={{fontSize: 20, color: COLORS.black}}>
                  / {allQuestions.length}
                </Text>
              </View>

              {/* Retry Quiz Button */}
              <TouchableOpacity onPress={restartQuiz} style={styles.retryBox}>
                <Text style={styles.retryText}>Retry Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Background Image (Not Yet) */}
      </View>
    </SafeAreaView>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  questionCounter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  counterText: {
    color: COLORS.white,
    opacity: 0.6,
  },
  question: {
    color: COLORS.white,
    fontSize: 30,
    marginTop: 10,
  },
  optionBox: {
    borderWidth: 3,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  option: {
    fontSize: 20,
    color: COLORS.white,
  },
  statusOption: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusOptionIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  buttonBox: {
    marginTop: 30,
    width: '100%',
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: COLORS.white,
    textAlign: 'center',
  },
  modalBox: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox2: {
    backgroundColor: COLORS.white,
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalBox3: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 20,
  },
  retryBox: {
    backgroundColor: COLORS.accent,
    padding: 20,
    width: '100%',
    borderRadius: 20,
  },
  retryText: {
    fontSize: 20,
    color: COLORS.white,
    textAlign: 'center',
  },
});
