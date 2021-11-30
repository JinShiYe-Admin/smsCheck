<template>
	<view class="imglistbx">
		<view :class="['imglistItem',columnNum==3?'column3':'column4']" v-for="(item,index) in showList" :key='index'>
			<image :src="item" class="itemImg" @click="previewImage(index)" mode="aspectFill"></image>
			<icon size="18" type="cancel" class="cancelBtn" @click="deleteImg(index)" v-if="deleteBtn"></icon>
		</view>
		<!-- 上传控件 -->
		<view :class="['imglistItem',columnNum==3?'column3':'column4']" @click="chooseImg" v-if="control&&showControl">
			<view class="itemImg uploadControl">+</view>
		</view>
		<view class="clear"></view>
		<compress ref="compress" />
	</view>
</template>

<script>
	import compress from '@/components/MarsXHChang-CavansCompressImg/compress.vue'
	export default {
		props: {
			//是否显示上传控件
			control: {
				type: Boolean,
				default: true
			},
			//是否显示上删除按钮
			deleteBtn: {
				type: Boolean,
				default: true
			},
			//行数量 
			columnNum: {
				type: [Number, String],
				default: 4
			},
			//上传最大数量
			maxCount: {
				type: Number,
				default: 4
			},
			//选择模式  album 从相册选图，camera 使用相机，默认二者都有。
			sourceType: {
				type: Array,
				default () {
					return ['album', 'camera']
				}
			},
			//显示的最大数量
			showMaxCount: {
				type: Number,
				default: 4
			},
			//服务返回回调的图片数组--回填
			mode: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data() {
			return {
				showList: [],
				modeLength: 0,
				showControl: true,
				firstInit: true
			}
		},
		components: {
			compress
		},
		watch: {
			mode(v) {
				this.init(v)
			},
			showList() {
				if (this.showList.length >= this.showMaxCount) {
					this.showControl = false
					return
				};
				this.showControl = true;
			}
		},
		created() {
			this.init(this.mode)
		},
		methods: {
			init(v) {
				if (this.firstInit) {
					this.modeLength = v.length
					this.firstInit = !this.firstInit
				}
				if (this.mode.length != 0) {
					this.showList = v;
					return
				};
				this.showList = [];
			},
			// 选择图片
			chooseImg() {
				uni.chooseImage({
					sizeType: ['compressed '],
					sourceType: this.sourceType,
					count: this.maxCount,
					success: (chooseImageRes) => {
						console.log('chooseImageRes:' + JSON.stringify(chooseImageRes));
						let tempArr = [];
						// #ifdef H5
						for (var i = 0; i < chooseImageRes.tempFilePaths.length; i++) {
							var tempUrl = chooseImageRes.tempFilePaths[i];
							this.compressImgH5(tempUrl, (returnUrl) => {
								tempArr.push(returnUrl);
								if (tempArr.length == chooseImageRes.tempFilePaths.length) {
									let tempFilePaths = tempArr;
									let tempFiles = chooseImageRes.tempFiles;
									tempFilePaths = tempFilePaths.slice(0, this.showMaxCount - this
										.showList.length);
									tempFilePaths.forEach((item) => {
										this.showList.push(item);
									})
									console.log("tempFiles: ", tempFiles);
									this.$emit("chooseFile", this.showList, tempFilePaths, tempFiles);
								}
							})
						}
						// #endif
						// #ifdef APP
						for (var i = 0; i < chooseImageRes.tempFilePaths.length; i++) {
							var tempUrl = chooseImageRes.tempFilePaths[i];
							this.compressImgApp(tempUrl, (returnUrl) => {
								tempArr.push(returnUrl);
								if (tempArr.length == chooseImageRes.tempFilePaths.length) {
									let tempFilePaths = tempArr;
									let tempFiles = chooseImageRes.tempFiles;
									tempFilePaths = tempFilePaths.slice(0, this.showMaxCount - this
										.showList.length);
									tempFilePaths.forEach((item) => {
										this.showList.push(item);
									})
									console.log("tempFiles: ", tempFiles);
									this.$emit("chooseFile", this.showList, tempFilePaths, tempFiles);
								}
							})
						}
						// #endif
					}
				});
			},
			compressImgH5(tempUrl, callback) {
				console.log('tempUrl:' + tempUrl);
				const compressParams = {
					src: tempUrl // 必选： 要压缩的图片地址
				}
				this.$refs.compress.compress(compressParams).then(filePath => {
					console.log('filePath:' + filePath);
					callback(filePath);
				})
			},
			compressImgApp(tempUrl, callback) {
				uni.compressImage({
					src: tempUrl,
					width: '60%',
					success: res => {
						console.log(res.tempFilePath);
						callback(res.tempFilePath);
					},
					fail: res => {
						console.log('fail:' + res);
					}
				})
			},
			getBase64Image(img) {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, img.width, img.height);
				var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
				var dataURL = canvas.toDataURL("image/" + ext);
				return dataURL;
			},
			dataURLtoFile(dataUrl, fileName) {
				var arr = dataUrl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], fileName, {
					type: mime
				});
			},
			//删除图片
			deleteImg(eq) {
				let deleteImg = this.showList;
				deleteImg.splice(eq, 1); //删除临时路径
				let fileeq = eq - this.modeLength
				this.$emit("imgDelete", deleteImg, eq, fileeq)
			},
			// 预览图片
			previewImage(eq) {
				let getUrl = this.showList;
				let newList = []
				getUrl.map(item => {
					newList.push(item.split('?')[0])
				})
				uni.previewImage({
					current: newList[eq],
					urls: newList
				})
			},
		}
	}
</script>

<style scoped>
	/* 上传  str */
	.imglistbx {
		width: 100%;
		height: 100%;
	}

	.imglistItem {
		position: relative;
		float: left;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
	}

	.column3 {
		width: 33.3333%;
		height: 160rpx;
	}

	.column4 {
		width: 25%;
		height: 130rpx;
	}

	.itemImg {
		width: 70%;
		height: 100%;
		margin: 0 auto;
		display: block;
		border-radius: 10rpx;
	}

	.cancelBtn {
		position: absolute;
		top: -10rpx;
		right: 10rpx;
	}

	/* 上传控件 */
	.uploadControl {
		font-size: 50rpx;
		color: #888;
		background-color: #EEEEEE;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/*  上传  str end*/
	.clear {
		clear: both;
	}
</style>
