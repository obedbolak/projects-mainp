import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Animated,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { BannerData, BannerItem } from "@/assets/BannerData";

import {
  SCREEN_WIDTH,
  normalize,
  normalizeFontSize,
} from "@/helpers/deviceUtils";

// Adjusted ExtendedBannerItem type to handle _id as string
type ExtendedBannerItem = Omit<BannerItem, "_id"> & { _id: string };

const Banner: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<ExtendedBannerItem>>(null);

  const extendedBannerData: ExtendedBannerItem[] = useMemo(
    () => [
      ...BannerData.slice(-1).map((item) => ({
        ...item,
        _id: item._id?.toString.toString(),
      })),
      ...BannerData.map((item) => ({
        ...item,
        _id: item._id?.toString.toString(),
      })),
      ...BannerData.slice(0, 1).map((item) => ({
        ...item,
        _id: item._id?.toString.toString(),
      })),
    ],
    []
  );

  const reversedData = useMemo(
    () => [...extendedBannerData].reverse(),
    [extendedBannerData]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % extendedBannerData.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [extendedBannerData.length]);

  useEffect(() => {
    if (activeIndex === 0) {
      flatListRef.current?.scrollToIndex({
        index: BannerData.length,
        animated: false,
      });
      setActiveIndex(BannerData.length);
    } else if (activeIndex === extendedBannerData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
      setActiveIndex(1);
    }
  }, [activeIndex, extendedBannerData.length]);

  const RenderItem = ({ item }: { item: ExtendedBannerItem }) => (
    <View style={styles.cardContainer}>
      <Pressable onPress={() => alert(item._id?.toString)}>
        <View style={styles.cardWrapper}>
          <Image style={styles.card} source={{ uri: item.coverImageUri }} />
          <View
            style={[
              styles.cornerLabel,
              { backgroundColor: item.cornerLabelColor },
            ]}
          >
            <Text style={styles.cornerLabelText}>{item.cornerLabelText}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );

  const getItemLayout = (_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise<void>((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={isReversed ? reversedData : extendedBannerData}
        renderItem={RenderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialScrollIndex={1}
        scrollEnabled={true}
      />
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {BannerData.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 0.5) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 0.5) * SCREEN_WIDTH,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={index}
              style={[styles.paginationDot, { opacity }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH,
  },
  cardWrapper: {
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    overflow: "hidden",
  },
  card: {
    width: SCREEN_WIDTH,
    height: normalize(SCREEN_WIDTH * 0.3),
  },
  cornerLabel: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 8,
  },
  cornerLabelText: {
    fontFamily: "Poppins-Bold",
    fontSize: normalizeFontSize(8),
    color: "#fff",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  paginationDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#595959",
    margin: 8,
  },
});

export default Banner;
