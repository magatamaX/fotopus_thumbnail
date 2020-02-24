import React, { Fragment } from 'react';
import Carousel, { Modal, ModalGateway } from "react-images";

const modalStyles = {
	blanket: (base) => {
		console.log(base);
		return {
			...base,
			zIndex: 10000,
	}},
	positioner: (base) => ({
			...base,
			zIndex: 10001,
	})
};

const carouselStyles = {
	container: base => ({
		...base,
		padding: 10,
	}),
	view: (base) => {
		console.log(base);
		return {
			...base,
			lineHeight: 0,
			position: 'relative',
			textAlign: 'center',
			boxSizing: 'border-box',
			'& > figure > img': {
				// position: 'absolute',
				maxWidth: 900,
				maxHeight: 750
			},
		}
	},
	footer: (base, state) => ({
		...base,
		color: '#FFFFFF',
		minHeight: 42,
		paddingBottom: 0,

		'& a': {
			color: state.interactionIsIdle ? 'black' : '#00d7ff',
			transition: 'color 300ms',
		},
	}),
}

const ModalBox = ({
  isOpen,
  images,
  currentIndex,
  onClose
}) => {
  return (
    <Fragment>
      <div id="photo-gallery">
        <ModalGateway>
          {isOpen ? (
            <Modal
                onClose={onClose}
                styles={modalStyles}>
                <Carousel
										currentIndex={currentIndex}
										// frameProps={{ autoSize: 'height' }}
										styles={carouselStyles}
                    views={images.map(({ id, title, name, description}) => ({
												src: `/city/images/${id}.jpg`,
												title,
												name,
                        description
                    }))}
                    components={{
											View: ({ currentView, isFullscreen }) => {
												// console.log('🌰', props);
												// console.log(getStyles('view'));
												return (
													<div className="modal-view" style={{
														position: 'relative',
														textAlign: 'center',
														boxSizing: 'border-box',
														width: '100vw',
														height: '100vh',
														padding: '40px 0 20px'
													}}>
														<figure data-name={currentView.title} className="modal-view__image" style={{
															position: 'absolute',
															top: '50%',
															left: '50%',
															transform: 'translate(-50%, -50%)',
														}}>
															<img style={!isFullscreen ? { maxWidth: 900, maxHeight: 750 } : { maxHeight: '80vh' }} src={currentView.src} alt={currentView.title} />
															<div style={{ margin: '16px auto 0', color: '#fff', maxWidth: 700, lineHeight: 1.5 }}>
																<p style={{ fontSize: 16, fontWeight: 'bold' }}>
																	<span style={{ display: 'inline-block' }}>{currentView.title}</span>
																	<span style={{ display: 'inline-block', marginLeft: 24 }}>{currentView.name}</span>	
																</p>
																<p style={{ fontSize: 16, marginTop: 16, textAlign: 'left' }}>{currentView.description}</p>
															</div>
														</figure>
													</div>
												)
											}}}
                />
            </Modal>
          ) : null}
        </ModalGateway>
        </div>
    </Fragment>
  )
};

export default ModalBox;