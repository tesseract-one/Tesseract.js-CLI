---
to: <%= h.changeCase.paramCase(name) %>/<%= h.changeCase.pascalCase(name) %>/Base.lproj/LaunchScreen.storyboard
---
<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="14490.70" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="01J-lp-oVM">
    <device id="retina4_7" orientation="portrait">
        <adaptation id="fullscreen"/>
    </device>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="14490.49"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="EHf-IW-A2E">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <view key="view" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <rect key="frame" x="0.0" y="0.0" width="375" height="667"/>
                        <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <imageView userInteractionEnabled="NO" contentMode="scaleToFill" horizontalHuggingPriority="251" verticalHuggingPriority="251" image="SplashImage" translatesAutoresizingMaskIntoConstraints="NO" id="EVc-th-aaM">
                                <rect key="frame" x="0.0" y="20" width="375" height="647"/>
                                <color key="backgroundColor" red="<%= red %>" green="<%= green %>" blue="<%= blue %>" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
                            </imageView>
                        </subviews>
                        <color key="backgroundColor" red="<%= red %>" green="<%= green %>" blue="<%= blue %>" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
                        <constraints>
                            <constraint firstItem="EVc-th-aaM" firstAttribute="top" secondItem="6Tk-OE-BBY" secondAttribute="top" id="0Rm-oH-ffw"/>
                            <constraint firstItem="EVc-th-aaM" firstAttribute="leading" secondItem="6Tk-OE-BBY" secondAttribute="leading" id="Yom-XQ-faZ"/>
                            <constraint firstItem="6Tk-OE-BBY" firstAttribute="trailing" secondItem="EVc-th-aaM" secondAttribute="trailing" id="e88-XE-G89"/>
                            <constraint firstAttribute="bottom" secondItem="EVc-th-aaM" secondAttribute="bottom" id="huC-2x-SNa"/>
                        </constraints>
                        <viewLayoutGuide key="safeArea" id="6Tk-OE-BBY"/>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="53" y="375"/>
        </scene>
    </scenes>
    <resources>
        <image name="SplashImage" width="375" height="667"/>
    </resources>
    <color key="tintColor" red="0.0" green="0.47843137250000001" blue="1" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
</document>
