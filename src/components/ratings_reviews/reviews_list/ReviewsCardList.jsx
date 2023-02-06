import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import ReviewCard from './ReviewCard';
import ActionButtons from './ActionButtons';
import ImageModal from '../../shared/ImageModal';

const makeStarFilters = (starFilter) => {
  const filter = [];
  for (const key in starFilter) {
    if (starFilter[key]) {
      filter.push(key);
    }
  }
  return filter;
};

export default function ReviewsCardList({
  productReviews, setShowReviewModal, starFilter, reviewListTopRef, setRerender, searchInput,
  debouncedSearch,
}) {
  const [reviewIndex, setReviewIndex] = useState(2); // Start it off at two reviews
  const [filterBy, setFilterBy] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageURL, setModalImageURL] = useState('');
  const [moreState, setMoreState] = useState(false); // Current state of more reviews button

  const actionButtonsRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    setFilterBy(makeStarFilters(starFilter));
  }, [starFilter]);

  const handleMoreClick = () => {
    setMoreState(true);
    setReviewIndex(reviewIndex + 2);

    setTimeout(() => {
      actionButtonsRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleImageClick = (e) => {
    if (e.target.src) {
      setModalImageURL(e.target.src);
      setShowModal(true);
    }
  };

  const handleModalClick = () => {
    setShowModal(false);
  };

  const handleHelpfulClick = (reviewID) => {
    // Not sure why its giving unauthorized in axios but not postman
    axios.put(`http://localhost:8081/reviews/${reviewID}/helpful`).then(() => {
      console.log('Helpful reqeuest sent');
    }).catch(() => {
      console.log('error occurred sending put request');
    });
  };

  const handleReportClick = (reviewID) => {
    axios.put(`http://localhost:8081/reviews/${reviewID}/report`).then(() => {
      console.log('Report request sent');
    }).then(() => {
      setRerender([]);
    }).catch(() => {
      console.log('error occurred sending put request');
    });
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // scrollHeight = height of current scroll (max height)
    // scrollTop = current position of our scroller
    // clientHeight = how big the client is (the box for the scroll)
    if ((scrollHeight - (scrollTop + clientHeight)) < 100 && moreState) {
      setReviewIndex(reviewIndex + 5);
    }
  };

  let filteredProductReviews = [];

  // ---- Sort by rating
  if (filterBy.length === 0) {
    filteredProductReviews = productReviews;
  } else {
    filteredProductReviews = productReviews.filter((productReview) => (
      filterBy.includes(productReview.rating.toString())
    ));
  }

  // ---- Sort by search with debounce of 500ms

  if (debouncedSearch.length >= 3) {
    filteredProductReviews = filteredProductReviews.filter((review) => (
      review.summary.toLowerCase().includes((debouncedSearch.toLowerCase()))
      || review.body.toLowerCase().includes((debouncedSearch.toLowerCase()))
    ));
  }

  // ---- Implement logic to put highlighting onto the words that are matched

  // if (debouncedSearch.length >= 3) {
  //   filteredProductReviews = filteredProductReviews.filter((review) => {
  //     if (review.summary.toLowerCase().includes((debouncedSearch.toLowerCase()))
  //     || review.body.toLowerCase().includes((debouncedSearch.toLowerCase()))) {
  //       let searchRegExp = new RegExp(`${debouncedSearch}`, 'gi');
  //       let matchedIndexes = [];

  //       while (searchRegExp.exec(review.summary) !== null) {
  //         matchedIndexes.push(searchRegExp.lastIndex);
  //       }
  //       console.log(matchedIndexes);

  //       if (matchedIndexes.length) {
  //         // if greater than length 0
  //         // console.log(review.summary.slice(47-(debouncedSearch.length),47));
  //         review.testHighlight = [];
  //         review.testHighlight.push(
  //           <span>{review.summary.slice(0, matchedIndexes[0]-debouncedSearch.length)}</span>
  //         );
  //         matchedIndexes.forEach((matchIndex) => {
  //           review.testHighlight.push(
  //             <mark>{review.summary.slice(matchIndex-debouncedSearch.length, matchIndex)}</mark>
  //           );
  //         });
  //         review.testHighlight.push(
  //           <span>{review.summary.slice(matchedIndexes[matchedIndexes.length - 1])}</span>
  //         );
  //       } else {
  //         review.testHighlight = [];
  //       }

  //       return true;
  //     }
  //   });
  // } else {
  //   filteredProductReviews.forEach((review) => {
  //     review.testHighlight = [];
  //   });
  // }

  const reviewElements = useMemo(() => (
    filteredProductReviews.map((review) => (
      <ReviewCard
        key={review.review_id}
        review={review}
        handleImageClick={handleImageClick}
        handleHelpfulClick={handleHelpfulClick}
        handleReportClick={handleReportClick}
        debouncedSearch={debouncedSearch}
      />
    ))
  ), [filteredProductReviews]);

  return (
    <div>
      { reviewElements.length
        ? (
          <div className="review-scroll" onScroll={handleScroll} ref={scrollRef}>
            <div ref={reviewListTopRef} />
            <div className="review-scroll-item">
              {reviewElements.slice(0, reviewIndex)}
            </div>
          </div>
        )
        : null }
      <ActionButtons
        handleMoreClick={handleMoreClick}
        setShowReviewModal={setShowReviewModal}
        totalReviews={filteredProductReviews.length}
        reviewIndex={reviewIndex}
        actionButtonsRef={actionButtonsRef}
        setReviewIndex={setReviewIndex}
        setMoreState={setMoreState}
      />
      {showModal && (
        <ImageModal
          url={modalImageURL}
          onClick={handleModalClick}
        />
      )}
    </div>
  );
}
