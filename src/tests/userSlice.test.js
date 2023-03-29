import reducer, { setExistingState, deleteExistingUser,
  setUsername,
  setLevel,
  setRank,
  setMusicVolume,
  setGold,
  setChestLastOpened,
  setBannerFilePath,
  setSlimeType,
  setSlimeSkin,
  setStatus,
  setFriends,
  setMessage,
  setFriendRequests,
  setBannerUnlocked,
  setSlimePath,
  setDaysSinceLastChest,
  setUnreadMessages } from '../Slices/userSlice'
import { TimeStamp } from '../utils/test-utils';


test('should return the initial state', () => {
  expect(reducer(undefined, { type: undefined })).toEqual(
    {data: {             
        username: null,
        level: null,
        rank: null,
        musicVolume: null,
        gold: null,
        chestLastOpenedOn: null,
        bannerFilepath: null,
        slimeType: null,
        slimeSkin: null,
        status: null,
        friends: null,
        message: null,
        friendRequests: [],
        bannerUnlocked: 0b0000000010001000000011000010,
        slimePath: null,
        daysSinceLastChest: null, 
    }}
  )
})

// Used when user data is obtained from Firestore and needs to be imported into the store
test('should return the existing state fed in', () => {
  const existingState = {
    username: "testr7",
    level: 1,
    rank: 2,
    musicVolume: "0.01",
    gold: 1375,
    chestLastOpenedOn: {
        nanoseconds: 195000000,
        seconds: 1680064396
    },
    bannerFilepath: "/Account/Banners/Head in the Clouds.jpg",
    slimeType: "Fire",
    slimeSkin: 3,
    status: "ONLINE",
    friends: null,
    message: "Hello I am a good slime!!!!!",
    friendRequests: [],
    bannerUnlocked: 557507,
    slimePath: "assets/GameArt/FireSlime/FireSlime3",
    daysSinceLastChest: 0.6193552199074074, 
  }
  expect(reducer(undefined, setExistingState(existingState))).toEqual(
    {data: {             
        username: "testr7",
        level: 1,
        rank: 2,
        musicVolume: "0.01",
        gold: 1375,
        chestLastOpenedOn: {
            nanoseconds: 195000000,
            seconds: 1680064396
        },
        bannerFilepath: "/Account/Banners/Head in the Clouds.jpg",
        slimeType: "Fire",
        slimeSkin: 3,
        status: "ONLINE",
        friends: null,
        message: "Hello I am a good slime!!!!!",
        friendRequests: [],
        bannerUnlocked: 557507,
        slimePath: "assets/GameArt/FireSlime/FireSlime3",
        daysSinceLastChest: 0.6193552199074074, 
    }}
  )
})

// Making sure slimePath is being computed properly.
// Dependent on slimeType and slimeSkin
test('should return the correct slime path', () => {
    const withSlimeType = reducer(undefined, setSlimeType("Fire"))
    const withSlimeTypeAndSlimeSkin = reducer(withSlimeType, setSlimeSkin(3))
    expect(reducer(withSlimeTypeAndSlimeSkin, setSlimePath())).toEqual(
      {data: {             
          username: null,
          level: null,
          rank: null,
          musicVolume: null,
          gold: null,
          chestLastOpenedOn: null,
          bannerFilepath: null,
          slimeType: "Fire",
          slimeSkin: 3,
          status: null,
          friends: null,
          message: null,
          friendRequests: [],
          bannerUnlocked: 0b0000000010001000000011000010,
          slimePath: `assets/GameArt/FireSlime/FireSlime3`,
          daysSinceLastChest: null, 
      }}
    )
  })

// Making sure setDaysSinceLastChest is being computed properly.
// Dependent on chestLastOpenOn and current date.
test('case where chest is just opened', () => {
    const withDaysSinceLastChest = reducer(undefined, setChestLastOpened(new TimeStamp((new Date()).getTime()/1000, 0)));
    const withBoth = reducer(withDaysSinceLastChest, setDaysSinceLastChest());
    // console.log(withBoth)
    expect(withBoth.data.daysSinceLastChest < 1).toEqual(
        true
      )
})

test('case where chest is opened 6 hours ago', () => {
    // 6 * 60 * 60 to get time in seconds
    const withDaysSinceLastChest = reducer(undefined, setChestLastOpened(new TimeStamp((new Date()).getTime()/1000 - 21600, 0)));
    const withBoth = reducer(withDaysSinceLastChest, setDaysSinceLastChest());
    // console.log(withBoth)
    expect(withBoth.data.daysSinceLastChest < 1).toEqual(
        true
      )
})

test('case where chest is opened 25 hours ago', () => {
    // 25 * 60 * 60 to get time in seconds
    const withDaysSinceLastChest = reducer(undefined, setChestLastOpened(new TimeStamp((new Date()).getTime()/1000 - 90000, 0)));
    const withBoth = reducer(withDaysSinceLastChest, setDaysSinceLastChest());
    console.log(withBoth)
    expect(withBoth.data.daysSinceLastChest < 1).toEqual(
        false
      )
})

// Testing that store is being set to null upon logout action
test('user should be null', () => {
  expect(reducer(undefined, deleteExistingUser())).toEqual({
    data: null
  })
})

// Below are tests for pure reducers (simply store updating)

test('should add correct username', () => {
  expect(reducer(undefined, setUsername('testUser'))).toEqual({
    data: {
      username: 'testUser',
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})


test('should add correct username', () => {
  expect(reducer(undefined, setUsername('testUser'))).toEqual({
    data: {
      username: 'testUser',
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Level', () => {
  expect(reducer(undefined, setLevel(10))).toEqual({
    data: {
      username: null,
      level: 10,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Rank', () => {
  expect(reducer(undefined, setRank('Diamond'))).toEqual({
    data: {
      username: null,
      level: null,
      rank: 'Diamond',
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Music Volume', () => {
  expect(reducer(undefined, setMusicVolume(50))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: 50,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Gold', () => {
  expect(reducer(undefined, setGold(500))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: 500,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})


test('should add correct Chest Last Open', () => {
  expect(reducer(undefined, setChestLastOpened('2022-05-10'))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: '2022-05-10',
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Banner Filepath', () => {
  expect(reducer(undefined, setBannerFilePath('/images/banner.jpg'))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: '/images/banner.jpg',
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Slime Type', () => {
  expect(reducer(undefined, setSlimeType('Green'))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: 'Green',
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Slime Skin', () => {
  expect(reducer(undefined, setSlimeSkin(3))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: 3,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Status', () => {
  expect(reducer(undefined, setStatus('online'))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: 'online',
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})


test('should add correct Friends', () => {
  const friendsList = ['Bob', 'Alice', 'Charlie']
  expect(reducer(undefined, setFriends(friendsList))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: friendsList,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Message', () => {
  expect(reducer(undefined, setMessage('Hello World'))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: 'Hello World',
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct Friend Requests', () => {
  const requestsList = ['John', 'Sarah']
  expect(reducer(undefined, setFriendRequests(requestsList))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: requestsList,
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
    }
  })
})

test('should add correct UnreadMessages', () => {
  expect(reducer(undefined, setUnreadMessages(3))).toEqual({
    data: {
      username: null,
      level: null,
      rank: null,
      musicVolume: null,
      gold: null,
      chestLastOpenedOn: null,
      bannerFilepath: null,
      slimeType: null,
      slimeSkin: null,
      status: null,
      friends: null,
      message: null,
      friendRequests: [],
      bannerUnlocked: 0b0000000010001000000011000010,
      slimePath: null,
      daysSinceLastChest: null,
      unreadMessages: 3,
    }
  })
})