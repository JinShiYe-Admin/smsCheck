<template>
	<view class="compress">
		<canvas :style="{ width: canvasSize.width, height: canvasSize.height }" canvas-id="myCanvas"></canvas>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				canvasSize: {
					width: '0px',
					height: '0px'
				}
			}
		},
		methods: {
			// 压缩
			compress(params) {
				return new Promise(async (resolve, reject) => {
					// 等待图片信息
					let info = await this.getImageInfo(params.src).then(info=>info).catch(err=>err);
					
					if(!info){
						reject('获取图片信息异常');
						return;
					}
					
					// 设置最大 & 最小 尺寸
					const maxSize = params.maxSize || 900;
					const minSize = params.minSize || 640;
					
					// 当前图片尺寸
					let {width,height} = info;
					
					// 非 H5 平台进行最小尺寸校验
					// #ifndef H5
					if(width <= minSize && height <= minSize){
						resolve(params.src);
						return;
					}
					// #endif
					
					// 最大尺寸计算
					if (width > maxSize || height > maxSize) {
						if (width > height) {
							height = Math.floor(height / (width / maxSize));
							width = maxSize;
						} else {
							width = Math.floor(width / (height / maxSize));
							height = maxSize;
						}
					}
					// 设置画布尺寸
					this.$set(this,"canvasSize",{
						width: `${width}rpx`,
						height: `${height}rpx`
					});
					
					// Vue.nextTick 回调在 App 有异常，则使用 setTimeout 等待DOM更新
					setTimeout(() => {
						const ctx = uni.createCanvasContext('myCanvas', this);
						ctx.clearRect(0,0,width, height)
						ctx.drawImage(info.path, 0, 0, uni.upx2px(width), uni.upx2px(height));
						ctx.draw(false, () => {
							uni.canvasToTempFilePath({
								x: 0,
								y: 0,
								width: uni.upx2px(width),
								height: uni.upx2px(height),
								destWidth: width,
								destHeight: height,
								canvasId: 'myCanvas',
								fileType: params.fileType || 'jpg',
								quality: params.quality || 0.7,
								success: (res) => {
									let resultPath = res.tempFilePath
									// 在H5平台下，tempFilePath 为 base64 需转换为 path
									// #ifdef H5
									const base64Code = this.dataURLtoBlob(resultPath)
									resultPath = URL.createObjectURL(base64Code)
									// #endif
									resolve(resultPath);
								},
								fail:(err)=>{
									console.log('fail', err)
									reject(null);
								}
							},this);
						});
					}, 300);
				});
			},
			dataURLtoBlob(dataurl) {
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n) //8位无符号整数，长度1个字节
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n)
				}
				return new Blob([u8arr], {
					type: mime,
				})
			},
			// 获取图片信息
			getImageInfo(src){
				return new Promise((resolve, reject)=>{
					uni.getImageInfo({
						src,
						success: (info)=> {
							resolve(info);
						},
						fail: () => {
							reject(null);
						}
					});
				});
			}
		}
	}
</script>

<style scoped>
	.compress{
		position: fixed;
		width: 12px;
		height: 12px;
		overflow: hidden;
		top: -99999px;
		left: 0;
	}
</style>

